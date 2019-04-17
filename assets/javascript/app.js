var TIME_ALLOWED_QUESTION = 500;

function TriviaGame(totalSeconds) {
    this.totalQuestionsCount = 0,
        this.totalCorrectAnswers = 0,
        this.totalIncorrectAnswers = 0,
        this.totalUnansweredAnswers = 0,
        this.timerTotalSeconds = totalSeconds,
        this.questionTimerFunction = function (timeLeft, total) {
            if (timeLeft >= 0) {
                $('#timer').html(timeLeft + ' second(s) left.');
                var perfectTimeSofar = Math.floor(((total - timeLeft) / total) * 100);
                $('.progress-bar').css('width', perfectTimeSofar + '%');
                $('.progress-bar').attr('aria-valuenow', perfectTimeSofar);
                window.QUESTION_TIMER = setTimeout(window.CURRENT_GAME.questionTimerFunction.bind(null, --timeLeft, total), 1000);
            } else {
                window.CURRENT_GAME.rewindTimer();
            }
        },
        this.displayTimer = function (timeLeft) {

            $('#timerDiv').fadeIn("slow", function () {

            });

            this.questionTimerFunction(timeLeft, this.timerTotalSeconds);
        },
        this.rewindTimer = function () {

            function timerFunction(timeLeft, total) {
                if (timeLeft <= total) {

                    var perfectTimeSofar = Math.floor(((total - timeLeft) / total) * 100);
                    $('.progress-bar').css('width', perfectTimeSofar + '%');
                    $('.progress-bar').attr('aria-valuenow', perfectTimeSofar);
                    setTimeout(timerFunction.bind(null, ++timeLeft, total), 100);
                } else {
                    window.CURRENT_GAME.showNextQuestion();
                }
            }

            $('#timer').html('Next question starting soon...');
            $('.progress-bar').css('width', 100 + '%');
            $('.progress-bar').attr('aria-valuenow', 100);

            setTimeout(timerFunction.bind(null, 0, 100), 500);

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
        this.verifyAnswer = function () {

        },
        this.addResultsSlide = function () {
            var newSlide = $('<div class="my-3 p-3 bg-white rounded shadow-sm panel panel-primary result-slide">');

            var panelHeading = $('<div class="panel-heading">');
            panelHeading.append('<h4>Results</h4>')
            newSlide.append(panelHeading);

            var newSlidePanelBody = $('<div class="panel-body">');
            newSlidePanelBody.append('<p>' + 'You did pretty good' + '</p>');

            newSlide.append(newSlidePanelBody);

            $('#carouselSlides').append(newSlide);
        },
        this.addQuestionSlides = function () {

            for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {

                var newSlide = $('<div class="my-3 bg-white rounded shadow-sm panel panel-primary question-slide">');

                var panelHeading = $('<div class="panel-heading">');
                panelHeading.append('<h4>' + 'Question #' + (questionIndex + 1) + '</h4>')
                newSlide.append(panelHeading);

                var newSlidePanelBody = $('<div class="panel-body">');
                newSlidePanelBody.append('<p>' + questions[questionIndex].Question + '</p>');
                for (var answerIndex = 0; answerIndex < questions[questionIndex].Answers.length; answerIndex++) {

                    var questionRadioLabelId = questionIndex + '__' + answerIndex + '__answerRadioLabel';
                    var questionRadioButtonId = questionIndex + '__' + answerIndex + '__answerRadioButton';
                    var questionRadioLabel = $('<label class="col-md-6 btn btn-lg btn-primary btn-block" id="' + questionRadioLabelId + '"><span class="btn-label">' +
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

                            passedCorrectAnswerIndex: questions[questionIndex].AnswerIndex
                        },
                        function (s) {

                            s.stopPropagation();

                            var choice = $(this).find('input:radio').val();
                            clearTimeout(window.QUESTION_TIMER);

                            if (choice == s.data.passedCorrectAnswerIndex) {
                                $(this).parent().parent().parent().find('.correctAnswerSpan').show();
                                window.CURRENT_GAME.totalCorrectAnswers += 1;
                            } else {
                                $(this).parent().parent().parent().find('.incorrectAnswerSpan').show();
                                window.CURRENT_GAME.totalIncorrectAnswers += 1;
                            }
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
        Question: ' question?',
        Answers: ['Russia', 'Brazil', 'England', 'France'],
        Hint: 'this is a hint 11',
        AnswerIndex: 0
    }),
    new Object({
        Question: ' question?',
        Answers: ['Russia', 'Brazil', 'England', 'France'],
        Hint: 'this is a hint 222',
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