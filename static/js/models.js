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
	, setAnswer : function() {
		console.log("inside setAnswer main question model");
	}
	
});

models.MultipleChoiceQuestion = models.Question.extend({
	initialize : function() {
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
		console.log("this is a multiplechoice question");
		console.log(this);

	}

	, setAnswer : function(answerObj) {
		console.log("inside setAnswer for multiplechoice");
		//this.set('answer',answerObj);
		//return this.get('answer');

	}

});

models.GeoMultipleLineString = models.Question.extend({
	initialize : function() {
		this.set('language','en');
	}
	
	, display : function() {
		console.log("this is a multiplechoice question");
		console.log(this);
	}

	, setAnswer : function() {
		console.log("inside geo question setAnswer");

		var directions = this.get('directions');
		this.set('answer',{
			  summary : directions.summary
			, path : directions.overview_path
			, polyline : directions.overview_polyline
		});

		var answerView = new views.answer_container({
			el : '#'+this.get('id'),
			parent : '#answer_container',
			model: this
		});

		this.set("answerView", answerView);
		return this.get('answer');

	}
});


models.Answer = Backbone.Model.extend({});

models.mapmarker = Backbone.Model.extend({
	hide : function() {
		this.attributes.marker.setVisible(false);
		
	}

});