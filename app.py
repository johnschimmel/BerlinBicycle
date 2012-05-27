# -*- coding: utf-8 -*-
import os

from flask import Flask, session, request, url_for, escape, render_template, jsonify

from mongoengine import *
from models import *

app = Flask(__name__)
app.debug = True

import sys
print("The Python version is %s.%s.%s" % sys.version_info[:3])

#mongolab connection
connect('berlinbicycle', host=os.environ.get('MONGOLAB_URI'))

@app.route('/')
def index():
	
	templateData = {
		'title' : 'Testing 123'
	}
	return render_template('main/index.html', **templateData) #Hello World!'

@app.route('/dbtest')
def dbtest():



	titles = []
	

	data = {"title": "my test"}
	newP = Post(**data)
	newP.save()

	#print(Post.objects.count())
	for post in Post.objects:
		titles.append(post.title)

	
	print "********************"
	return jsonify({'titles':'abc'})



if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)
