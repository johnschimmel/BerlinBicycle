var surveyApi = function() {
	
	var survey_path = "/static/";
	var current_survey = "";
	
	var obj = {

		getCurrentSurvey : function() {
			return current_survey;
		}

		, buildSurvey : function(){
			this.buildQuestions();
		}

		, buildQuestions : function() {
			current_survey['qCollection'] = new Backbone.Collection();

			for(q in current_survey.questions) {
				var question = current_survey.questions[q];

				if (question.response_type == "multiplechoice") {
					var tmpModel = new questionMultipleChoiceModel(question);
				} else {
					var tmpModel = new questionModel(question);	
				}
				tmpModel.display();
				current_survey['qCollection'].add( tmpModel );
			}
			console.log(current_survey);
		}

		, load : function(surveyId) {
			var that = this;
		
			jQuery.ajax({
				  url : survey_path + surveyId
				, type : 'GET'
				, dataType : 'JSON'
				, success : function(response) {
					if (response["status"] == "OK") {
						current_survey = response.survey;
						that.buildSurvey();
					}
					

				}
				, error : function(error) {
					console.error(error);

				}
			})

		}

	}

	return obj;
};

window.questionModel = Backbone.Model.extend({
	initialize : function() {
		
	},

	display : function() {
		console.log('displaying question model');
		console.log(this);
	}
});

window.questionMultipleChoiceModel = questionModel.extend({
	initialize : function() {


	},

	display : function() {
		console.log("this is a multiplechoice question");
		console.log(this);

	}
})
