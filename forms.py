from flaskext.wtf import Form, TextField, Required, BooleanField, validators, SelectField
from flaskext.wtf.html5 import EmailField
from flask import Flask, session

class TestForm(Form):
	SECRET_KEY = 'DONTTELL'
	title = TextField('Title!!!', validators=[Required()])


class RegisterForm(Form):
	email = EmailField('Email Address', validators=[], description="Enter your email address.")
	anonymous = BooleanField('Anonymous', [validators.Required()])
	type_of_cyclist = SelectField('Type of Cyclist', choices=[
        ('bold_and_the_brave','Bold and the Brave'),
        ('no_way_no_how',"No Way, No How")])

	