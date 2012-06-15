# -*- encoding: utf-8 -*-
import os

from flask import Flask, session, request, url_for, escape, render_template, json, jsonify, flash, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask.ext.login import (LoginManager, current_user, login_required,
                            login_user, logout_user, UserMixin, AnonymousUser,
                            confirm_login, fresh_login_required)

from mongoengine import *
from forms import *
import models
from libs.user import *
from libs.response import *
from libs.dynContent import *

from cartodb import CartoDBAPIKey,CartoDBException

class CartoDBConnector(object):

 	def __init__(self):
 		self.user =  os.environ.get('CARTODB_EMAIL')
 		self.api_key = os.environ.get('CARTODB_APIKEY')
 		self.cartodb_domain = os.environ.get('CARTODB_DOMAIN')
 		

 		self.cl = CartoDBAPIKey(self.api_key, self.cartodb_domain)
 	
 	def newResponse(self, response_data):
 		try:

 			sqlValues = {
 				"survey" : response_data.get('survey'),
 				"surveyid" : response_data.get('surveyid'),
 				"path":response_data.get('path'),
 				"choose_a_road" : response_data.get('choose_a_road'),
 				"how_do_you_feel" : response_data.get('how_do_you_feel'),
 				"link_to_destinations" : response_data.get('link_to_destinations'),
 				"is_the_gradient_amenable_to_cycling" : response_data.get('is_the_gradient_amenable_to_cycling'),
 				"street_offers_priority_through_intersections" : response_data.get("street_offers_priority_through_intersections")
 			}

 			sqlStr = "INSERT INTO dynamicconnections \
 				(survey, surveyid, the_geom, choose_a_road, how_do_you_feel, link_to_destinations,is_the_gradient_amenable_to_cycling,street_offers_priority_through_intersections) \
 				values \
 				('%(survey)s', '%(surveyid)s', ST_GeomFromText('MULTILINESTRING((%(path)s))',4326), '%(choose_a_road)s', '%(how_do_you_feel)s', '%(link_to_destinations)s','%(is_the_gradient_amenable_to_cycling)s', '%(street_offers_priority_through_intersections)s')" % sqlValues
 			
 			app.logger.debug('cartodb insert sql')
 			app.logger.debug(sqlStr)

 			query = self.cl.sql(sqlStr.encode('utf-8','replace'))
 			app.logger.debug('query results')
 			app.logger.debug(query)
 			
 			return query
 		
 		except CartoDBException as e:
 			print ("some error occurred",e)
 			return e

	def test(self):
		try:

			sqlstr = "INSERT INTO dynamicconnections \
			(survey, surveyid, the_geom, choose_a_road, how_do_you_feel, link_to_destinations,is_the_gradient_amenable_to_cycling,street_offers_priority_through_intersections) \
			values \
			('None', 'None', ST_GeomFromText('MULTILINESTRING((13.40568 52.51951, 13.40669 52.51879, 13.40726 52.51843, 13.40835 52.51758, 13.40918 52.51698, 13.40998 52.5164, 13.41032 52.51623, 13.41057 52.51616, 13.41177 52.51596, 13.41234 52.51586, 13.41315 52.51576, 13.41348 52.51575))',4326), '%(street)s', 'stressed', 'yes','yes', 'no')" % {'street':'Spandauer Straße and Stralauer Straße'}
			query = self.cl.sql(sqlstr.encode('utf-8','replace'))
			return query
		except CartoDBException as e:
			print ("some error ocurred", e)
			return e


app = Flask(__name__)
app.debug = True
app.secret_key = os.environ.get('SECRET_KEY')

#mongolab connection
connect('berlinbicycle', host=os.environ.get('MONGOLAB_URI'))


login_manager = LoginManager()

login_manager.anonymous_user = Anonymous
login_manager.login_view = "login"
login_manager.login_message = u"Please log in to access this page."
login_manager.refresh_view = "reauth"

@login_manager.user_loader
def load_user(id):
	if id is None:
		redirect('/login')

	user = User()
	user.get_by_id(id)
	if user.is_active():
		return user
	else:
		return None


login_manager.setup_app(app)

@app.route("/")
def index():
    return render_template("/auth/index.html")


@app.route("/secret")
@fresh_login_required
def secret():
    return render_template("/auth/secret.html")

@app.route("/register", methods=["GET","POST"])
def register():
	if request.method == 'POST' and "email" in request.form:
		email = request.form['email']
		anonymous = True
		type_of_cyclist = request.form['type_of_cyclist']

		user = User(email, anonymous, type_of_cyclist)
		user.save()
		if login_user(user, remember="no"):
			flash("Logged in!")
			return redirect(request.args.get("next") or url_for("index"))
		else:
			flash("unable to log you in")

	registerForm = RegisterForm(csrf_enabled=True)
	templateData = {

		'form' : registerForm
	}

	return render_template("/auth/register.html", **templateData)
	
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST" and "email" in request.form:
        email = request.form["email"]
        user = User()
        user.get_by_email(email)
        
     	if user.get_by_email(email) and user.is_active():
			remember = request.form.get("remember", "no") == "yes"

			if login_user(user, remember=remember):
				flash("Logged in!")
				return redirect(request.args.get("next") or url_for("index"))
			else:
				flash("unable to log you in")

    return render_template("/auth/login.html")


@app.route("/reauth", methods=["GET", "POST"])
@login_required
def reauth():
    if request.method == "POST":
        confirm_login()
        flash(u"Reauthenticated.")
        return redirect(request.args.get("next") or url_for("index"))
    return render_template("/auth/reauth.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out.")
    return redirect(url_for("index"))


@app.route('/survey')
def survey():
	
	contentObj = Content()
	
	templateData = {
		'texts' : contentObj.getAllText(language='de'),
		'title' : 'Test Survey'
	}
	session['survey_user'] = True
	return render_template('/main/survey.html', **templateData);
	
@app.route('/api/survey/save', methods=['GET','POST'])
def surveySubmit():

	if not session.has_key('survey_user'):
		return redirect('/survey')
		#return "You must be a valid survey user"
	if request.method == "POST":

		theResponse = SurveyResponse()

		submissionData = json.loads(request.form['responsejson'])

		app.logger.debug('survey response data')
		app.logger.debug(submissionData)


		for question in submissionData.get('responses'):
			if question['answer'].get('response_type') == "GeoMultipleLineString":
				
				if question['answer'].get('path'):
				
					dictOfTextResponses = theResponse.prepResponsesForDB( submissionData.get('responses') )
					geojson = theResponse.prepPathForGeoJSON(question['answer'].get('path'))
					survey = models.SurveyResponse()
					survey.survey = submissionData.get('survey')
					survey.surveyId = submissionData.get('surveyId')
					survey.type_of_cyclist = "Bold"
					survey.geo = geojson
					survey.responses = dictOfTextResponses
					survey.save()

					# save to cartodb
					cartodbPath = theResponse.prepPathForCartodb(question['answer'].get('path'))

					#create sql
					cdb = CartoDBConnector()

					cartodbValue = dictOfTextResponses
					cartodbValue['path'] = cartodbPath
					result = cdb.newResponse(cartodbValue)

					return json.dumps(question['answer'].get('path'))

		return "hmm, not sure if that went through"

@app.route('/test')
def dbtest():
	cdb = CartoDBConnector()
	result = cdb.test()
	print result
	return "ok"

@app.route('/submit',  methods=['POST'])
def form_submit_test():
	tForm = TestForm(csrf_enabled=True)
	
	print request.form

	if request.form and tForm.validate():
		return jsonify(request.form)
	else:
		return "Sorry"


@app.route('/dbtest')
def dbQuery():

	title = []
	for post in Post.objects:
		titles.append(post.title)
	
	print "********************"
	return jsonify({'titles':titles})



@app.route('/admin')
def admin():

	contentObj = Content()
	allText = contentObj.getAllText()

	#create content
	templateData = {
		'texts' : allText
	}
	return render_template('/admin/index.html', **templateData)

@app.route('/api/admin/content/new', methods=['POST'])
def admin_content_new():

	formData = request.form
	for d in formData:
		app.logger.debug(d)

	contentObj = Content()
	mainContent = contentObj.getMainDocument()

	#set content from form
	language_content_id = formData.get('content_id')
	mainContent.content[language_content_id] = {
		'en' : formData.get('language[en]'),
		'de' : formData.get('language[de]'),
		'description' : formData.get('description')
	}
	mainContent.save()
	
	flash('New text added to database.','info')
	return redirect('/admin')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)
