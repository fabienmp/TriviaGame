var TIME_ALLOWED_QUESTION = 5;

function TriviaGame(totalSeconds) {
    this.totalQuestionsCount = 0,
        this.totalCorrectAnswers = 0,
        this.totalIncorrectAnswers = 0,
        this.totalUnansweredQuestions = 0,
        this.timerTotalSeconds = totalSeconds,
        this.questionTimerFunction = function (timeLeft, total) {

            if (timeLeft >= 0) {
                $('#timer').html(timeLeft + ' second(s) left.');
                var perfectTimeSofar = Math.floor(((total - timeLeft) / total) * 100);
                $('.progress-bar').css('width', perfectTimeSofar + '%');
                $('.progress-bar').attr('aria-valuenow', perfectTimeSofar);
                window.QUESTION_TIMER = setTimeout(window.CURRENT_GAME.questionTimerFunction.bind(null, --timeLeft, total), 1000);
            
            } else {
                window.CURRENT_GAME.totalUnansweredQuestions += 1;
                window.CURRENT_GAME.updateResultSlide();
                window.CURRENT_GAME.rewindTimer();
            }

        },
        this.displayTimer = function (timeLeft) {

            $('#timerDiv').fadeIn("slow", function () {

            });

            this.questionTimerFunction(timeLeft, this.timerTotalSeconds);
        },
        this.nextQuestionTimerFunction = function(timeLeft, total)
        {
            if (timeLeft <= total) {
                var perfectTimeSofar = Math.floor(((total - timeLeft) / total) * 100);
                $('.progress-bar').css('width', perfectTimeSofar + '%');
                $('.progress-bar').attr('aria-valuenow', perfectTimeSofar);
                window.NEXT_QUESTION_TIMER = setTimeout(window.CURRENT_GAME.nextQuestionTimerFunction.bind(null, ++timeLeft, total), 100);
            } else {
                clearTimeout(window.NEXT_QUESTION_TIMER);
                window.CURRENT_GAME.showNextQuestion();
            }

        },
        this.rewindTimer = function () {

            $('#timer').html('Next question starting soon...');
            $('.progress-bar').css('width', 100 + '%');
            $('.progress-bar').attr('aria-valuenow', 100);

            setTimeout(this.nextQuestionTimerFunction.bind(null, 0, 50), 500);

        },
        this.showNextQuestion = function () {

            if (this.totalQuestionsCount > 0) {
                window.OWL_CONTROL.trigger('next.owl');
                this.totalQuestionsCount -= 1;
                this.displayTimer(this.timerTotalSeconds);
            } else {
                $('#timerDiv').fadeOut("slow ", function () {
                    window.OWL_CONTROL.trigger('next.owl');
                });
            }

        },
        this.addResultsSlide = function () {
            var newSlide = $('<div class="my-3 p-3 bg-white rounded shadow-sm panel panel-primary result-slide">');

            var panelHeading = $('<div class="panel-heading">');
            panelHeading.append('<h4>Results</h4>')
            newSlide.append(panelHeading);

            var newSlidePanelBody = $('<div class="panel-body">');
            newSlidePanelBody.append('<p id="resultSlide_Status">' + '</p>');
            newSlidePanelBody.append('<p id="resultSlide_CorrectAnswers">' + '</p>');
            newSlidePanelBody.append('<p id="resultSlide_IncorrectAnswers">' + '</p>');
            newSlidePanelBody.append('<p id="resultSlide_UnansweredQuestions">' + 'Unanswered Questions:' + '</p>');
            newSlidePanelBody.append('<a type="button" id="restartButton" class="btn btn-primary btn-lg" href="#initialSlide">Restart</a>')
            newSlide.append(newSlidePanelBody);
            
            $('#carouselSlides').append(newSlide);

            $('#restartButton').click(function (s) {
                window.CURRENT_GAME.reset();
            });

        },
        this.updateResultSlide = function () {
            var scoreLevel = Math.floor((this.totalCorrectAnswers / questions.length) * 100); 
            if(scoreLevel > 80)
            {
                $('#resultSlide_Status').text('You did very well, congratulations!');
            }
            else if(scoreLevel > 60)
            {
                $('#resultSlide_Status').text('You did pretty good! Practice makes perfect.');
            }
            else
            {
                $('#resultSlide_Status').text('You could have done better... Time to study again.');
            }
            
            $('#resultSlide_CorrectAnswers').text('Correct Answer(s): ' + this.totalCorrectAnswers);
            $('#resultSlide_IncorrectAnswers').text('Incorrect Answer(s): ' + this.totalIncorrectAnswers);
            $('#resultSlide_UnansweredQuestions').text('Unanswered Questions: ' + this.totalUnansweredQuestions);
        },
        this.addQuestionSlides = function () {

            for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {

                var newSlide = $('<div class="my-3 bg-white rounded shadow-sm panel panel-primary question-slide" data-hash="question_' + questionIndex + '">');

                var panelHeading = $('<div class="panel-heading">');
                panelHeading.append('<h4>' + 'Question #' + (questionIndex + 1) + '</h4>')
                newSlide.append(panelHeading);

                var newSlidePanelBody = $('<div class="panel-body">');
                newSlidePanelBody.append('<p>' + questions[questionIndex].Question + '</p>');
                for (var answerIndex = 0; answerIndex < questions[questionIndex].Answers.length; answerIndex++) {

                    var questionRadioLabelId = questionIndex + '__' + answerIndex + '__answerRadioLabel';
                    var questionRadioButtonId = questionIndex + '__' + answerIndex + '__answerRadioButton';
                    var questionRadioLabel = $('<label class="col-md-6 btn btn-lg btn-primary btn-block answerRadioLabel" id="' + questionRadioLabelId + '"><span class="btn-label">' +
                        '<i class="fa fa-angle-right"></i></span><input id="' + questionRadioButtonId + '" type="radio" name="answerRadioButton" value="' +
                        answerIndex + '" class="answerRadioButton">' +
                        questions[questionIndex].Answers[answerIndex] +
                        '</label>');
                    newSlidePanelBody.append(questionRadioLabel);

                }
                newSlide.append(newSlidePanelBody);

                var newSlidePanelFooter = $('<div class="panel-footer">');
                //newSlidePanelFooter.append('<p>' + questions[questionIndex].Hint + '</p>');
                newSlidePanelFooter.append('<span class="incorrectAnswerSpan" style="display: none;">Oops! The correct answer was ' +
                    questions[questionIndex].Answers[questions[questionIndex].AnswerIndex] +
                    '</span>');
                newSlidePanelFooter.append('<span class="correctAnswerSpan" style="display: none;">' + 'You clicked the correct answer!' +
                    '</span>');
                newSlide.append(newSlidePanelFooter);

                $('#carouselSlides').append(newSlide);

                for (var answerIndex = 0; answerIndex < questions[questionIndex].Answers.length; answerIndex++) {

                    var questionRadioButtonId = questionIndex + '__' + answerIndex + '__answerRadioButton';

                    $('#' + questionRadioButtonId).click({
                            passedQuestionIndex: questionIndex,
                            passedTotalAnswers: questions[questionIndex].Answers.length,
                            passedCorrectAnswerIndex: questions[questionIndex].AnswerIndex
                        },
                        function (s) {

                            s.stopPropagation();

                            var choice = $(this).val();
                            clearTimeout(window.QUESTION_TIMER);

                            if (choice == s.data.passedCorrectAnswerIndex) {
                                $(this).parent().parent().parent().find('.correctAnswerSpan').show();
                                window.CURRENT_GAME.totalCorrectAnswers += 1;
                            } else {
                                $(this).parent().parent().parent().find('.incorrectAnswerSpan').show();
                                window.CURRENT_GAME.totalIncorrectAnswers += 1;
                            }

                            for (var answerIndex = 0; answerIndex < s.data.passedTotalAnswers; answerIndex++) {
                                var answerElement = $('#' + s.data.passedQuestionIndex + '__' + answerIndex + '__answerRadioButton');
                                answerElement.off('click');
                                if (answerIndex == s.data.passedCorrectAnswerIndex) {
                                    answerElement.parent().removeClass('answerRadioLabel');
                                } else {
                                    answerElement.parent().addClass('disabled');
                                    answerElement.parent().removeClass('answerRadioLabel');
                                }
                            }

                            window.CURRENT_GAME.updateResultSlide();
                            window.CURRENT_GAME.rewindTimer();

                        });
                }

            }
        },
        this.reset = function () {
            this.totalCorrectAnswers = 0;
            this.totalIncorrectAnswers = 0;
            this.totalUnansweredQuestions = 0;
            this.totalQuestionsCount = questions.length;
            $('.correctAnswerSpan').hide();
            $('.incorrectAnswerSpan').hide();
            for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
                for (var answerIndex = 0; answerIndex < questions[questionIndex].Answers.length; answerIndex++) {
                    var answerElement = $('#' + questionIndex + '__' + answerIndex + '__answerRadioButton');

                    answerElement.parent().removeClass('disabled');
                    answerElement.parent().addClass('answerRadioLabel');

                    var questionRadioButtonId = questionIndex + '__' + answerIndex + '__answerRadioButton';

                    $('#' + questionRadioButtonId).off('click');
                    $('#' + questionRadioButtonId).click({
                            passedQuestionIndex: questionIndex,
                            passedTotalAnswers: questions[questionIndex].Answers.length,
                            passedCorrectAnswerIndex: questions[questionIndex].AnswerIndex
                        },
                        function (s) {

                            s.stopPropagation();

                            var choice = $(this).val();
                            clearTimeout(window.QUESTION_TIMER);

                            if (choice == s.data.passedCorrectAnswerIndex) {
                                $(this).parent().parent().parent().find('.correctAnswerSpan').show();
                                window.CURRENT_GAME.totalCorrectAnswers += 1;
                            } else {
                                $(this).parent().parent().parent().find('.incorrectAnswerSpan').show();
                                window.CURRENT_GAME.totalIncorrectAnswers += 1;
                            }

                            for (var answerIndex = 0; answerIndex < s.data.passedTotalAnswers; answerIndex++) {
                                var answerElement = $('#' + s.data.passedQuestionIndex + '__' + answerIndex + '__answerRadioButton');
                                answerElement.off('click');
                                if (answerIndex == s.data.passedCorrectAnswerIndex) {
                                    answerElement.parent().removeClass('answerRadioLabel');
                                } else {
                                    answerElement.parent().addClass('disabled');
                                    answerElement.parent().removeClass('answerRadioLabel');
                                }
                            }

                            window.CURRENT_GAME.updateResultSlide();
                            window.CURRENT_GAME.rewindTimer();

                        });
                }
            }
        },
        this.init = function () {

            if (questions.length > 0) {
                this.totalQuestionsCount = questions.length;

                this.addQuestionSlides();
                this.addResultsSlide();

                window.OWL_CONTROL = $('.owl-carousel').owlCarousel({
                    loop: false,
                    margin: 100,
                    nav: false,
                    items: 1,
                    dots: false,
                    checkVisible: false,
                    mouseDrag: false
                })

                $('#startButton').click({
                    passedTotalSeconds: this.timerTotalSeconds
                }, function (s) {
                    window.CURRENT_GAME.showNextQuestion();
                });

            }
        }
}

var questions = [
    new Object({
        Question: 'What powerful force allows black holes to absorb light?',
        Answers: ['Nuclear fusion',
            'Electromagnetism',
            'Gravity',
            'Nuclear bonding',
            "All of the above"
        ],
        Hint: '',
        AnswerIndex: 2
    }),
    new Object({
        Question: 'How do scientists know that black holes exist?',
        Answers: ['By running experiments on the Sun',
            'By observing objects and light around black holes',
            'By viewing black holes with powerful telescopes',
            'All of the above', 'None of the Above'
        ],
        Hint: '',
        AnswerIndex: 1
    }),
    new Object({
        Question: 'How do black holes form?',
        Answers: ['When planets collide',
            'When nuclear bombs explode',
            'When comets strike planets',
            'When giant stars explode',
            'When asteroids hit stars'
        ],
        Hint: '',
        AnswerIndex: 3
    }),
    new Object({
        Question: 'Where do super massive black holes likely exist?',
        Answers: ['At the center of the Solar System',
            'Inside gas giant planets',
            'At the center of galaxies',
            'All of the above',
            'None of the Above'
        ],
        Hint: '',
        AnswerIndex: 2
    }),
    new Object({
        Question: "True or False: Black holes are invisible because they don't reflect light.",
        Answers: ['TRUE', 'FALSE'],
        Hint: '',
        AnswerIndex: 0
    })
];

$(function () {
    var game = new TriviaGame(TIME_ALLOWED_QUESTION);
    window.CURRENT_GAME = game;
    window.CURRENT_GAME.init();
});

$(document).ready(function () {

});