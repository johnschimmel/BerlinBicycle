# -*- coding: utf-8 -*-
import os

from flask import Flask, session, request, url_for, escape, render_template, jsonify

from mongoengine import *
from models import *
from forms import *

app = Flask(__name__)
app.debug = True
app.secret_key = os.environ.get('SECRET_KEY')

#mongolab connection
connect('berlinbicycle', host=os.environ.get('MONGOLAB_URI'))

@app.route('/')
def index():
	
	templateData = {
		'title' : 'Testing 123'
	}
	return render_template('main/index.html', **templateData) #Hello World!'

@app.route('/test')
def dbtest():
	tForm = TestForm(csrf_enabled=True)
	
	templateData = {
		'form' : tForm
	}
	print templateData['form'].csrf_token
	return render_template('main/testform.html', **templateData)

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
