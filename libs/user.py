import os

from flask import Flask, session, request, url_for, escape, render_template, jsonify, flash, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask.ext.login import (LoginManager, current_user, login_required,
                            login_user, logout_user, UserMixin, AnonymousUser,
                            confirm_login, fresh_login_required)

from mongoengine import *
from forms import *
import models


class User(UserMixin):
    def __init__(self, email=None, anonymous=None, type_of_cyclist=None, active=True, id=None):
        self.email = email
        self.anonymous = anonymous
        self.type_of_cyclist = type_of_cyclist
        self.active = active
        self.id = None


    def save(self): 
        newUser = models.User(email=self.email, type_of_cyclist=self.type_of_cyclist, anonymous=self.anonymous, active=self.active)
        newUser.save()
        print "new user id = %s " % newUser.id
        self.id = newUser.id
        return self.id

    def get_by_email(self, email):
    	query = models.User.objects(email=email).limit(1)
    	if len(query) == 1:
    		dbUser = query[0]
    		print dbUser.id

    		print  "------ inside user.save ------"
    		self.email = dbUser.email
    		self.anonymous = dbUser.anonymous
    		self.type_of_cyclist = dbUser.type_of_cyclist
    		self.active = dbUser.active
    		self.id = dbUser.id
    		return self
        else:
            return None
    
    def get_by_id(self, id):
    	dbUser = models.User.objects.with_id(id)
    	if dbUser:
    		self.email = dbUser.email
    		self.anonymous = dbUser.anonymous
    		self.type_of_cyclist = dbUser.type_of_cyclist
    		self.active = dbUser.active
    		self.id = dbUser.id

    		return self
    	else:
    		return None

    def is_active(self):
       return self.active


class Anonymous(AnonymousUser):
    name = u"Anonymous"
