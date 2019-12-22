
const totalSeconds = 40; // Total Number of seconds the user has to answer all Questions 
const penaltySeconds = 5; // Number of seconds to subtract if a question is not answered correctly

var btnStart = document.querySelector('#btnStart');
var btnScores = document.querySelector('#btnScores');
var btnQuiz = document.querySelector('#btnQuiz');
var quizStart = document.querySelector('#quizStart');
var quizQuestions  = document.querySelector('#quizQuestions');
var scoresDisplay = document.querySelector('#scoresDisplay');
var lblTimeRemaining = document.querySelector('#lblTimeRemaining');
var interval;
var timeRemaining = 0; // Time remaining in seconds (Score)
var scores  = JSON.parse(localStorage.getItem('scores'));
var qIndex = 0; // Question Index
/*
    Get Users Initials and save Initials and Score to localStorage
*/
function getUserInitials(){
    var usrInitials = prompt('Your Score: ' + timeRemaining + ', Enter your Initials: ');
    if ( scores == null || scores == undefined){
        scores = [ 
            {
                initals: usrInitials,
                score: timeRemaining
            }
        ];
    }else{
        scores.push( { initals: usrInitials, score: timeRemaining } );
    }
    localStorage.setItem('scores', JSON.stringify(scores));
}
/*
    User Pressed a Question Button (Answer)
*/
function btnQuestionClicked(btn){
    if (btn.textContent === questions[qIndex].answer){
        $(btn).css('background-color','lime');
    }else{
        $(btn).css('background-color','red');
        timeRemaining -= 5;
    }
    $('#q' + qIndex).addClass('d-none');
    qIndex++;
    if (qIndex < questions.length){
        $('#q' + qIndex).removeClass('d-none');
    } else{
        //Done answering Questions or Ran out of time
        clearInterval(interval);
        //Hide Questions
        $('.question').addClass('d-none');
        if (timeRemaining > 0){
            getUserInitials();
        }else{
            alert( "Game Over!  You have no time left, your score is 0.")
        }
        showScores();
    }
}
/*
    Build the List of Questions from the questions array
*/
function buildQuestionList(){
    for (var i=0; i< questions.length; i++){
        var newDiv = $("<div id='q" + i + "' class='question d-none'>");
        newDiv.html("<p>" + questions[i].title + "</p>");
        for  (var x=0; x<questions[i].choices.length; x++){
            newDiv.append("<button class='btn btn-primary ml-2 btn-answer' onclick='btnQuestionClicked(this)'>" + questions[i].choices[x] +"</button>");
        }
        console.log(newDiv.innerHTML);
        $('#quizQuestions').append(newDiv);
    }
}
/*
    Reload the Landing Page to start the Quiz
*/
function startQuiz(){
    clearInterval(interval);
    qIndex = 0;
    lblTimeRemaining.textContent = "00:00";
    quizStart.classList.remove('d-none');
    quizQuestions.classList.add('d-none');
    scoresDisplay.classList.add('d-none');
}
/*
    Display the Scores from the localStorage object (scores)
*/
function showScores(){
    clearInterval(interval);
    quizStart.classList.add('d-none');
    quizQuestions.classList.add('d-none');
    scoresDisplay.classList.remove('d-none');
    console.log(scores);
    scores  = JSON.parse(localStorage.getItem('scores'));
    if ( scores == null || scores == undefined){
        scoresDisplay.innerHTML = "<h2>There are currently no scores saved.</h2>";
    } else{
        scoresDisplay.innerHTML = "<h2>Here are the Saved Scores:</h2><br/>";
        for (var i=0; i<scores.length; i++){
            var newEl = $("<p>");
            newEl.text(scores[i].initals + " ............ " + scores[i].score);
            $('#scoresDisplay').append(newEl);
        }
    }
}
/* 
    Function to Display the Remaining Time
*/
function displayTime(){
    var minutes = Math.floor(timeRemaining/60);
    var seconds = timeRemaining - (minutes * 60);
    if (seconds < 10){
        lblTimeRemaining.textContent = minutes + ":0" + seconds;
    } else{
        lblTimeRemaining.textContent = minutes + ":" + seconds;
    }
}
/*
    User Clicked the Start button
*/
btnStart.addEventListener("click",function(event){
    timeRemaining = totalSeconds;
    quizStart.classList.add('d-none');
    buildQuestionList();
    quizQuestions.classList.remove('d-none');
    $('#q' + qIndex).removeClass('d-none');
    //Start the Timer Interval
    interval = setInterval(function(){
        timeRemaining--;
        displayTime();
        //if user is out of time then Game over
        // alert user game is over 
        if (timeRemaining === 0){
            clearInterval(interval);
            alert( "Game Over!  You have no time left, your score is 0.")
            showScores();
        }
    }, 1000)
})
/*
    NAV Button Event Listeners
*/
btnScores.addEventListener("click", showScores);
btnQuiz.addEventListener("click", startQuiz);


