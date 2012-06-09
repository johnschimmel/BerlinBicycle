var models = {};
models.Question = Backbone.Model.extend({
	  urlRoot : '/question'
	, initialize : function() {
		this.set('language','en');
	}
	, setLanguage : function(languageCode) {
		this.set('language')
	}

	, getLocalized : function(attrName, languageCode) {
		var getLanguage;

		if (_.isUndefined(languageCode)){
			getLanguage = this.get('language');
		} else {
			getLanguage = languageCode;
		}
		
		var tmpAttr = this.get(attrName);
		return tmpAttr[getLanguage];
	}

	, display : function() {
		console.log('displaying question model');
		console.log(this);
	}
});

models.MultipleChoiceQuestion = models.Question.extend({
	initialize : function() {


	},

	display : function() {
		console.log("this is a multiplechoice question");
		console.log(this);

	}
});

models.GeoMultipleLineString = models.Question.extend({
	initialize : function() {


	},

	display : function() {
		console.log("this is a multiplechoice question");
		console.log(this);

	}
});


models.Answer = Backbone.Model.extend({});

models.mapmarker = Backbone.Model.extend({
	hide : function() {
		this.attributes.marker.setVisible(false);
		
	}

});