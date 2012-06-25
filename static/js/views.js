var views = (function(){
	return {

		survey_status : Backbone.View.extend({
			initialize : function() {

				this.survey = this.options.survey.getCurrentSurvey();
				this.render();
			}

			, render : function() {
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#survey_status_template').html())
				// Compile the template using underscore
				
				var currentQuestion = this.options.survey.getCurrentQuestion();
				
				var renderedHTML = template({
	            	  title : this.survey.name
	            	, currentPosition : currentQuestion.get('position')
	            	, totalNumQuestions : this.survey.questions.length

	            });
	            
	            jQuery(this.el).html( renderedHTML );	
			}
			, update : function() {

				this.render();
			}


		})

		, question_title : Backbone.View.extend({

	        initialize: function(){
	            this.render();
	        }

	        , render: function(){
	        	
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#question_title_template').html())
				// Compile the template using underscore
	            jQuery(this.el).html( template({
	            	  question:this.model.getLocalized('question')
	            	, description : this.model.getLocalized('description')

	            }) );
	        }

		}),

		question_choice : Backbone.View.extend({
			events: {
				"change input[type=radio].question_choice_radio": "radioSelected"
			},

			initialize: function(){
	        	this.model.view = this;
	            this.render();
	        }
	        
	        , render: function(){
	        	
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#question_choice_template').html())
				// Compile the template using underscore
				var templateData = {
					  choice: this.model.getLocalized('text')
					, value : this.model.get('value')
					, action : this.model.get('action')
				};
	            jQuery(this.el).append( template(templateData) );

	            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
		
					jQuery('label[for]').click(function () {
						var el = jQuery(this).attr('for');
						if (jQuery('#' + el + '[type=radio], #' + el + '[type=checkbox]').attr('selected', !jQuery('#' + el).attr('selected'))) {
							return;
						} else {
							jQuery('#' + el)[0].focus();
							
						}
					});
				} 

				
	        }
	        , radioSelected : function(e) {
	        	localViews = survey.getLocalViews();
	        	localViews.button_controls.$el.find('.continueButton').addClass('btn-success').removeAttr('disabled');

	        	e.stopPropagation();
	        }
		}),

		geoselection : Backbone.View.extend({
			initialize : function() {
				this.render();
				
			}
			, className: "geo-selection"

			, render : function() {

				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#geoselection_container_template').html())
				jQuery(this.el).html( template({selection:this.options.selection}) );
			}
		}),

		answer_container : Backbone.View.extend({
			initialize : function() {
				this.render();
			}
			, className : "answer"
			, render : function() {

				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				
				var template = _.template(jQuery('#answer_container_template').html());

				var templateData = {
					id:"answer_"+this.model.get('id'),
					questionLabel:this.model.getLocalized('question'), 
					answer:{text:this.model.get('answerLocalized')}
				};
				
				jQuery(this.options.parent).append( template(templateData) );
			}
		}),

		button_basic : Backbone.View.extend({
			initialize : function(){
				this.render();
			}
			, events : {
				"click .continueButton" : "savecontinue"
			}

			, render : function() {
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#button_controls_template').html());
				jQuery(this.el).html(template());

			}
			, savecontinue : function(event) {
				survey.saveAnswerAndContinue();

			}
		})



	}
})();