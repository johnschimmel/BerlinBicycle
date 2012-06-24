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

		, getLanguage : function() {
			return language;
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
				
				localViews.survey_status.update();
				localViews.button_controls.$el.html('');
				return this.displayCurrentQuestion();

			} else {
				return false;
			}
		}
		, saveAnswerAndContinue : function() {
			localViews.button_controls.undelegateEvents();

			var question = this.getCurrentQuestion();

			if (question.get('response_type') == "multiplechoice") {
				var selectedAnswer = jQuery('input.question_choice_radio:checked').val();
				question.setAnswer(selectedAnswer);

				var action = jQuery('input.question_choice_radio:checked').data('action');
				if (action == "next") {
					this.nextQuestion();
				} else if (action == "end") {
					this.end();
				}
			
			} else {
				question.setAnswer();
				this.nextQuestion();
			}
			
			
			
			
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
				var choices = question.get('choices');
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
				tmpModel.unset('answers');

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
					
					jQuery(localViews.button_controls.$el).find('input.continueButton').addClass('btn-success').removeAttr('disabled');
					

					localViews.geoselection = new views.geoselection({
						  el : '#choices'
						, selection : data.directions.summary
					});
					geoQ.set('directions', data.directions);
				
				}
				
			})
			
		}

		, end : function() {

			//clean up existing views
			localViews.button_controls.undelegateEvents();
			_.each(localViews.choices, function(tmpView){
				tmpView.undelegateEvents();
				jQuery(tmpView.$el).remove();
			});

			jQuery(localViews.survey_status.$el).remove();
			jQuery(localViews.button_controls.$el).remove();
			jQuery(localViews.q_title.$el).remove();

			//display thank you end
			jQuery("#thankyou").show();

			//build final answer response object
			var qs = this.getQuestions();
			var s = this.getCurrentSurvey();

			var responses = _.map(qs.models, function(q) {
				
				var answer = q.get('answer');
				var newAnswer = {};
				var tmpPath = [];
				if (answer.path != undefined) {
					tmpPath = _.map(answer.path, function(latlng){
						return latlng.toUrlValue();
					});
					
					newAnswer.path = tmpPath;
					
				}
				newAnswer.response_type = q.get('response_type');
				newAnswer.text = answer.text;

				var answer = {
					question : q.get('id'),
					answer : newAnswer
				}

				return answer;
			})

			var surveyResponses = {
				survey : s.name,
				surveyId : s.id,
				responses : responses
			}

			this.responses = surveyResponses;
			jQuery.ajax({
				  url : '/api/survey/save'
				, type : 'POST'
				, dataType : 'JSON'
				, data : {responsejson:JSON.stringify(this.responses)}
				, success : function(response) {
					//console.log("success response");
					//console.log(response);

				}
				, error : function(error) {
					//console.log("error");
					//console.log(error);
				}
			});
			
		}

	}

	return obj;
};

