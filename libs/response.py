# -*- coding: utf-8 -*-
import os

from mongoengine import *
import models

class SurveyResponse(object):

	def __init__(self):
		self.test = "okie dokie"
	
	def prepResponsesForMongo(self, responses):
		surveyResponses = []

		for resp in responses:
			surveyResponses.append({ resp.get('question') : resp['answer'].get('text') })

		return surveyResponses

	def prepPathForGeoJSON(self, pathList):
		lngLats = []
		for latlng in pathList:
			ll = latlng.split(",")
			
			lngLats.append( [float(ll[1]), float(ll[0])] )

		geojson = {"type":"MultiLineString","coordinates":[lngLats]}
		return geojson

	# takes in a list of [[lat1,lng1], [lat2,lng2],...]
	# returns a string "lng1 lat1, lng2 lat2" - formatted for cartodb sql insert
	def prepPathForCartodb(self, pathList):

		lngLats = []
		for latlng in pathList:
			ll = latlng.split(",")
			lngLats.append("%s %s" % (ll[1], ll[0]))

		return ", ".join(lngLats) # for example '-74.00021 40.74851, -73.99994 40.7484, -74.00043 40.74778, -74.00136 40.74649, -74.00226 40.74521'

	def display(self):
		print self.test
		