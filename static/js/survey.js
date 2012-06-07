var surveyApi = function() {
	
	var survey_path = "/static/";
	var current_survey = "";
	var questions = new collections.Questions();
	var language = "en";
	var currentPosition = 1;

	var obj = {
		
		setLanguage : function(languageCode) {
			language = languageCode;
		}
	
		, getCurrentSurvey : function() {
			return current_survey;
		}
		, getQuestions : function() {
			return questions;

		}
		, nextQuestion : function() {
			if (currentPosition < questions.length){
				currentPosition++;
				return this.displayCurrentQuestion();

			} else {
				return false;
			}
		}
		, getCurrentQuestion : function() {
			return questions.models[currentPosition-1];
		},

		displayCurrentQuestion : function() {
			question = this.getCurrentQuestion();

			if (question) {

				var q_title = new views.question_title({
					el : jQuery("#question_title"), 
					model: question
				});

				choices = question.get('choices');
				_.each(choices.models, function(choice){
					console.log(choice);
				});
			}
		}

		, buildSurvey : function(){
			this.buildQuestions();
		}

		, buildQuestions : function() {
			
			for(q in current_survey.questions) {
				var question = current_survey.questions[q];

				switch(question.response_type) {
					case "multiplechoice":
						var tmpModel = new models.MultipleChoiceQuestion(question);
					case "geopoint":
						var tmpModel = new models.GeoPoint(question);
					default:
						var tmpModel = new models.Question(question);
				}
				
				tmpModel.set('choices', new collections.Choices(question.answers));
				tmpModel.set('language',language);
				delete tmpModel.unset('answers');

				questions.add( tmpModel );
				
			}
			
			this.displayCurrentQuestion();
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

