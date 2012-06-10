var surveyApi = function() {
	
	var survey_path = "/static/";
	var current_survey = "";
	var questions = new collections.Questions();
	var language = "en";
	var currentPosition = 1;
	var localViews = {};

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
		, saveAnswerAndContinue : function() {
			var question = this.getCurrentQuestion();
			console.log("about to setAnswer");
			question.setAnswer();
			//this.nextQuestion();
		}
		, getCurrentQuestion : function() {
			return questions.models[currentPosition-1];
		}
		, getLocalViews : function() {
			return localViews;
		}

		, displayCurrentQuestion : function() {
			var question = this.getCurrentQuestion();
			console.log('current questions');
			console.log(question.response_type);

			if (question) {

				localViews.q_title = new views.question_title({
					el : '#question_title', 
					model: question
				});

				localViews.continue_button = new views.button_basic({
					  el:'#continueButton'
					, model : question
				});


				jQuery("#choices").html('');
				choices = question.get('choices');
				for(n in choices.models) {
					var tmpChoice = choices.models[n];
					console.log(tmpChoice);
				}
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
						break;
					case "GeoMultipleLineString":
						var tmpModel = new models.GeoMultipleLineString(question);
						tmpModel.set({map:map});
						tmpModel.on('markerAdded', function(markers){
							//console.log("marker added : " + markers);
						});
						break;
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

		, set : function(data) {
			var that = this;
			//get GEO question
			geoQuestions = questions.where({response_type:"GeoMultipleLineString"});
			_.each(geoQuestions, function(geoQ) {
				
				if (_.isUndefined(data.markers) == false && data.markers.length >= geoQ.get('minMarkers')) {

					localViews.continue_button.$el.addClass('btn-success');
					localViews.continue_button.$el.removeClass('disabled');

					localViews.geoselection = new views.geoselection({
						  el : '#choices'
						, selection : data.directions.summary
					});
				}
				geoQ.set('directions', data.directions);
				console.log("new set")
				console.log(geoQ.get('directions'));
			})
			
		}

	}

	return obj;
};

