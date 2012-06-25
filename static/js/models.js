var models = {};
models.Question = Backbone.Model.extend({
	  urlRoot : '/question'
	, initialize : function() {
		this.set('language',survey.getLanguage());
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
		//console.log('displaying question model');
		//console.log(this);
	}
	, setAnswer : function() {
		//console.log("inside setAnswer main question model");
	}
	
});

models.MultipleChoiceQuestion = models.Question.extend({
	initialize : function() {
		this.set('language',survey.getLanguage());
	}
	

	, display : function() {
		//console.log("this is a multiplechoice question");
		//console.log(this);

	}

	, setAnswer : function(answer) {
		
		this.set('answer',{text:answer.value});
		this.set('answerLocalized',answer.localizedValue);

		var answerView = new views.answer_container({
			el : '#'+this.get('id'),
			parent : '#answer_container',
			model: this
		});

		this.set("answerView", answerView);
		
		if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
		
			jQuery('label[for]').on('click',function (e) {
				var el = jQuery(this).attr('for');
				if (jQuery('#' + el + '[type=radio], #' + el + '[type=checkbox]').attr('selected', !jQuery('#' + el).attr('selected'))) {
					return;
				} else {
					jQuery('#' + el)[0].focus();
					
				}
			});
		}
		return this.get('answerLocalized');

	}

});

models.GeoMultipleLineString = models.Question.extend({
	initialize : function() {
		this.set('language',survey.getLanguage());
	}
	
	, display : function() {
		//console.log("this is a multiplechoice question");
		//console.log(this);
	}

	, setAnswer : function() {
		//console.log("inside geo question setAnswer");
		
		google.maps.event.clearListeners(map, 'click');

		jQuery("a#resetMarkers").off('click').hide();

		var directions = this.get('directions');
		
		this.set('answer',{
			  text : directions.summary
			, path : directions.overview_path
			, polyline : directions.overview_polyline
		});

		this.set('answerLocalized',directions.summary);
		
		console.log("inside setAnswer");
		console.log(this.get('answerLocalized'));

		var answerView = new views.answer_container({
			el : '#'+this.get('id'),
			parent : '#answer_container',
			model: this
		});

		this.set("answerView", answerView);
		return this.get('answerLocalized');

	}
});

models.QuestionChoice = Backbone.Model.extend({
	initialize : function() {
		this.set('language',survey.getLanguage());
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

	, nextAction : function() {
		
	}
});



models.Answer = Backbone.Model.extend({});

models.mapmarker = Backbone.Model.extend({
	hide : function() {
		this.attributes.marker.setVisible(false);
		
	}

});