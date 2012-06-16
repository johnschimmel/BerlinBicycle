# -*- coding: utf-8 -*-
from mongoengine import *
import datetime

class Post(Document):
    title = StringField(max_length=120)


class User(Document):
	email = EmailField(unique=True)
	password = StringField(default=True)
	active = BooleanField(default=True)
	isAdmin = BooleanField(default=False)
	timestamp = DateTimeField(default=datetime.datetime.now())
	

class SurveyResponse(Document):
	timestamp = DateTimeField(default=datetime.datetime.now())
	survey = StringField()
	surveyId = StringField()
	geo = DictField(default={})
	responses = DictField(default={})
	type_of_cyclist = StringField()


class Content(Document):
	document_id = StringField()
	content = DictField()
