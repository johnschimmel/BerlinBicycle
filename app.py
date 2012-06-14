# -*- coding: utf-8 -*-
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

from cartodb import CartoDBAPIKey,CartoDBException

class CartoDBConnector(object):

 	def __init__(self):
 		self.user =  os.environ.get('CARTODB_EMAIL')
 		self.api_key = os.environ.get('CARTODB_APIKEY')
 		self.cartodb_domain = os.environ.get('CARTODB_DOMAIN')
 		

 		self.cl = CartoDBAPIKey(self.api_key, self.cartodb_domain)
 	
 	def newResponse(self, response_data):
 		try:

 			print response_data
 			print "--------------"

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
 			print sqlStr
 			query = self.cl.sql(sqlStr)
 			return query
 		
 		except CartoDBException as e:
 			print ("some error occurred",e)
 			return e

	def test(self):
		try:
		    query = self.cl.sql('select ST_AsGeoJSON(the_geom) as the_geom from test_line')
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
	templateData = {
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

		#testJSON = '{"name":"Test Survey","surveyId":"test_survey","responses":[{"question":"choose_a_road","answer":{"path":["40.74851,-74.00021","40.7484,-73.99994","40.74778,-74.00043","40.74649,-74.00136","40.74521,-74.00226","40.74462,-74.00269","40.74405,-74.00317","40.74289,-74.00404","40.7423,-74.00446","40.73816,-73.99463"],"response_type":"GeoMultipleLineString","text":"W 16th St"}},{"question":"is_the_gradient_amenable_to_cycling","answer":{"response_type":"multiplechoice","text":"no"}},{"question":"link_to_destinations","answer":{"response_type":"multiplechoice","text":"yes"}},{"question":"street_offers_priority_through_intersections","answer":{"response_type":"multiplechoice","text":"some"}},{"question":"how_do_you_feel","answer":{"response_type":"multiplechoice","text":"neutral"}}]}'
		#testData = json.loads(testJSON)
		print "received form submission"
		print request.form['responsejson']
		
		submissionData = json.loads(request.form['responsejson'])

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
					# {
					# 	"survey" : response_data.get('survey'),
		 		# 		"surveyid" : response_data.get('surveyid'),
		 		# 		"choose_a_road" : response_data.get('choose_a_road'),
		 		# 		"how_do_you_feel" : response_data.get('how_do_you_feel'),
		 		# 		"is_the_gradient_amenable_to_cycling" : response_data.get('is_the_gradient_amenable_to_cycling'),
		 		# 		"street_offers_priority_through_intersections" : response_data.get("street_offers_priority_through_intersections"),
					# 	"path" : cartodbPath
					# })

					return json.dumps(question['answer'].get('path'))

		return "hmm, not sure if that went through"

@app.route('/test')
def dbtest():
	#user = User()
	#user.get_by_email('john@base2john.com')
	#print user.id
	#print user.email
	
	survey = models.SurveyResponse()
	survey.type_of_cyclist = "Bold"
	survey.geo = { 
		"type": "MultiLineString",
  		"coordinates": [
			[ [100.0, 0.0], [101.0, 1.0] ],
			[ [102.0, 2.0], [103.0, 3.0] ]
		]}
	survey.responses = {
		'num1' : 'Yes',
		'num2' : 'No'
	}

	survey.save()

	return jsonify(survey)

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





if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)
