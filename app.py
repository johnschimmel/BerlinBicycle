import os

from flask import Flask, session, request, url_for, escape, render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def index():
	
	#app.logger.debug(os.environ.get('MONGOLAB_URI'))
	templateData = {
		'title' : 'Testing 123'
	}
	return render_template('main/index.html', **templateData) #Hello World!'

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)