from flaskext.wtf import Form, TextField, Required
from flask import Flask, session

class TestForm(Form):
	SECRET_KEY = 'DONTTELL'
	title = TextField('Title!!!', validators=[Required()])


