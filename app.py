# -*- coding: utf-8 -*-
import os

from flask import Flask, session, request, url_for, escape, render_template, jsonify, flash, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask.ext.login import (LoginManager, current_user, login_required,
                            login_user, logout_user, UserMixin, AnonymousUser,
                            confirm_login, fresh_login_required)

from mongoengine import *
from forms import *
import models
from libs.user import *

from cartodb import CartoDBAPIKey,CartoDBException

class CartoDBConnector(object):

 	def __init__(self):
 		self.user =  os.environ.get('CARTODB_EMAIL')
 		self.api_key = os.environ.get('CARTODB_APIKEY')
 		self.cartodb_domain = os.environ.get('CARTODB_DOMAIN')
 		

 		self.cl = CartoDBAPIKey(self.api_key, self.cartodb_domain)
 		
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

	return render_template('/main/survey.html', **templateData);
	

@app.route('/test')
def dbtest():
	#user = User()
	#user.get_by_email('john@base2john.com')
	#print user.id
	#print user.email
	cdb = CartoDBConnector()
	print " ------- testing cartodb -------"
	query = cdb.test()
	return jsonify(query)
	
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
