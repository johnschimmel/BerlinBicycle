# -*- coding: utf-8 -*-
from mongoengine import *

class Post(Document):
    title = StringField(max_length=120)