# -*- coding: utf-8 -*-
import os
import cartodb

class CartoDBConnector(object):

 	def __init__(self):
 		self.user =  os.environ.get('CARTODB_EMAIL')
 		self.api_key = os.environ.get('CARTODB_APIKEY')
 		self.cartodb_domain = os.environ.get('CARTODB_DOMAIN')
 		self.cl = cartodb.CartoDBAPIKey(self.api_key, self.cartodb_domain)
 		
	def test(self):
		try:
		    query = self.cl.sql('select ST_AsGeoJSON(the_geom) as the_geom from test_line')
		    print "running the query"
		    return query
		except cartodb.CartoDBException as e:
		    print ("some error ocurred", e)
		    return e
