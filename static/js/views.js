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
			initialize: function(){
	            this.render();
	        }
	        , className: "question-choice"
	        , render: function(){
	        	
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#question_choice_template').html())
				// Compile the template using underscore
	            jQuery(this.el).html( template({choice:'testing 123'}) );
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
				// Compile the template using underscore
				
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

				var template = _.template(jQuery('#answer_container_template').html())
				// Compile the template using underscore
				jQuery(this.options.parent).append( template({
						id:"answer_"+this.model.get('id'),
						questionLabel:this.model.getLocalized('question'), 
						answer:this.model.get('answer')
					}) 
				);
			}
		}),

		button_basic : Backbone.View.extend({
			initialize : function(){
				this.render();
			}
			, events : {
				"click" : "continue"
			}

			, render : function() {
				_.templateSettings = {
				  interpolate : /\{\{(.+?)\}\}/g
				};

				var template = _.template(jQuery('#button_controls_template').html());
				
				// Compile the template using underscore
				jQuery(this.el).html(template());

			}
			,continue : function(event) {

				console.log('this was clicked ' + this.id);
				survey.saveAnswerAndContinue();

			}
		})



	}
})();