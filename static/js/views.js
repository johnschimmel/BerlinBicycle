var views = (function(){
	return {

		question_title : Backbone.View.extend({

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
				jQuery(this.options.parent).append( template({id:this.options.id,answer:'testing 123'}) );
			}
		}),

		button_basic : Backbone.View.extend({
			initialize : function(){
				
			}
			, events : {
				"click" : "continue"
			}
			,continue : function(event) {
				alert("ok")
				survey.saveAnswerAndContinue();

			}
		})



	}
})();