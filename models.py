# -*- coding: utf-8 -*-
from mongoengine import *
import datetime

class Post(Document):
    title = StringField(max_length=120)


class User(Document):
	email = EmailField()
	anonymous = BooleanField(default=True)
	type_of_cyclist = StringField()
	timestamp = DateTimeField(default=datetime.datetime.now())
	active = BooleanField(default=True)


class SurveyResponse(Document):
	timestamp = DateTimeField(default=datetime.datetime.now())
	survey = StringField()
	surveyId = StringField()
	geo = DictField(default={})
	responses = ListField(default={})
	type_of_cyclist = StringField()
