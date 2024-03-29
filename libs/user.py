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


class User(UserMixin):
    def __init__(self, email=None, password=None, active=True, id=None):
        self.email = email
        self.password = password
        self.active = active
        self.isAdmin = False
        self.id = None


    def save(self): 
        newUser = models.User(email=self.email, password=self.password, active=self.active)
        newUser.save()
        print "new user id = %s " % newUser.id
        self.id = newUser.id
        return self.id

    def get_by_email(self, email):

    	dbUser = models.User.objects.get(email=email)
    	if dbUser:
            self.email = dbUser.email
            self.active = dbUser.active
            self.id = dbUser.id
            return self
        else:
            return None
    
    def get_by_email_w_password(self, email):

        try:
            dbUser = models.User.objects.get(email=email)
            
            if dbUser:
                self.email = dbUser.email
                self.active = dbUser.active
                self.password = dbUser.password
                self.id = dbUser.id
                return self
            else:
                return None
        except:
            print "there was an error"
            return None

    def get_by_id(self, id):
    	dbUser = models.User.objects.with_id(id)
    	if dbUser:
    		self.email = dbUser.email
    		self.active = dbUser.active
    		self.id = dbUser.id

    		return self
    	else:
    		return None

    def is_active(self):
       return self.active


class Anonymous(AnonymousUser):
    name = u"Anonymous"
