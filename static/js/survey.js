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
			console.log("inside nextQuestion");
			if (currentPosition < questions.length){
				currentPosition++;
				
				localViews.survey_status.update();
				localViews.button_controls.$el.html('');
				return this.displayCurrentQuestion();

			} else {
				return false;
			}
		}
		, saveAnswerAndContinue : function() {
			var question = this.getCurrentQuestion();

			if (question.get('response_type') == "multiplechoice") {
				var selectedAnswer = jQuery('input.question_choice_radio:checked').val();
				console.log(selectedAnswer);
				question.setAnswer(selectedAnswer);
			} else {
				question.setAnswer();
	
			}
			
			localViews.button_controls.undelegateEvents();
			
			this.nextQuestion();
		}
		, getCurrentQuestion : function() {
			
			tmpNext = questions.where({position:currentPosition});
			if (tmpNext.length == 1) {
				return _.first(tmpNext);
			} else {
				return False
			}
			
		}

		, getLocalViews : function() {
			return localViews;
		}

		, displayCurrentQuestion : function() {
			var question = this.getCurrentQuestion();
			if (question) {

				localViews.q_title = new views.question_title({
					el : '#question_title', 
					model: question
				});

				localViews.button_controls = new views.button_basic({
					  el:'#buttonContainer'
					, id: question.get('id')
					, model : question
				});

				jQuery("#choices").html('');
				choices = question.get('choices');
				localViews.choices = [];
				
				if (question.get('response_type') == "multiplechoice") {
					
					_.each(choices.models, function(choice){
					
						var tmpChoiceView = new views.question_choice({
							  el : '#choices'
							, model : choice
							, question : question
						});

						localViews.choices.push(tmpChoiceView);

					});	
				}
				

				
			}
		}

		, buildSurvey : function(){

			this.buildQuestions();

			localViews.survey_status = new views.survey_status({
				  el : "#survey_status"
				, survey : this
			});
			
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
				tmpChoices = _.map(question.answers, function(answer){
					return new models.QuestionChoice(answer);
				})
				tmpModel.set('choices', new collections.Choices(tmpChoices));
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
			var currentQ = this.getCurrentQuestion();

			geoQuestions = questions.where({response_type:"GeoMultipleLineString"});
			_.each(geoQuestions, function(geoQ) {
				
				if (currentQ.id==geoQ.id && _.isUndefined(data.markers) == false && data.markers.length >= geoQ.get('minMarkers')) {
					
					jQuery(localViews.button_controls.$el).find('button.continueButton').addClass('btn-success').removeAttr('disabled');
					

					localViews.geoselection = new views.geoselection({
						  el : '#choices'
						, selection : data.directions.summary
					});
					geoQ.set('directions', data.directions);
				
				}
				
			})
			
		}

	}

	return obj;
};

