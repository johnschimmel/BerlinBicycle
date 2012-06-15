# -*- encoding: utf-8 -*-
import os

from mongoengine import *
import models

class Content(object):

	def getMainDocument(self):
		query = {'document_id' : 'main_content'}
		results = models.Content.objects.get_or_create(**query)
		#get the document
		mainContent = results[0]
		
		if results[1]:
			#new document
			mainContent.content = {}
			mainContent.save()

		return mainContent

	def getAllText(self, language='en'):
		
		mainDocument = self.getMainDocument()

		localizedTexts = {}
		for text_id, languageDict in mainDocument.content.iteritems():
			localizedTexts[text_id] = languageDict.get(language)
		
		return localizedTexts
