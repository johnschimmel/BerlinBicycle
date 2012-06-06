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

		})
	}
})();