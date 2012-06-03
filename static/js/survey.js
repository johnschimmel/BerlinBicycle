var surveyApi = function() {
	
	var survey_path = "/static/";
	var current_survey = "";
	var questionModel = new Backbone.Model();

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
				//console.log(q);
				current_survey['qCollection'].add( new Backbone.Model(question) );
			}
			console.log(current_survey);
		}

		, load : function(surveyId) {
			var that = this;
			console.log(this);
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
}();
