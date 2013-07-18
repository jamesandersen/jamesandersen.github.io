/* Author: James Andersen
*/

window.MF = (function()
{
	var Modes = {
		STARTUP : 0,
		PRACTICE : 1,
		TIMED : 2
	};
	
	var Operations = {
		ADDITION : 0x1,
		SUBTRACTION: 0x2,
		MULTIPLICATION : 0x4,
		DIVISION : 0x8
	};
	
	var TEST_SECONDS = 120;
	var NUM_QUESTIONS = 30;
	
	var maxNumber = 12;
	var maxSubtractionNumber = 7;
	var questionIndex = 0;
	var currentAnswer;
	var mode = Modes.STARTUP;
	var currentProblemIndex = 0;
	var operations = Operations.ADDITION | Operations.SUBTRACTION;
	var timerId = null;
	var testStartTime = null;
	var lastProblem = null;
	
	var startPractice = function()
	{
		mode = Modes.PRACTICE;
		$('#startup').css('display', 'none');
		$('#return').css('visibility', 'visible');
		$('.question').css('display', 'block');
		nextQuestion();
	};
	
	var startTimed = function()
	{
		mode = Modes.TIMED;
		$('#startup').css('display', 'none');
		$('#progress').css('visibility', 'visible');
		$('.submit').css('visibility', 'visible');
		$('.question').css('display', 'block');
		
		// setup the question progress bar
		questionIndex = -1;
		var questions = $('#questions');
		questions.empty();
		for(var i = 0; i < NUM_QUESTIONS; i++)
		{
			var q = $('<div class="' + (i === 0 ? 'next' : 'next') + '"/>');
			questions.append(q);
		}
		
		// start the timer
		testStartTime = +new Date();
		$('#elapsed').height('0%');
		timerId = setInterval(onTick, 500);
		nextQuestion();
	};
	
	var onTick = function()
	{
		var elapsed = (+new Date()) - testStartTime;
		if(elapsed > (TEST_SECONDS * 1000))
		{
			clearTimeout(timerId);
		}
		else
		{
			var pctElapsed = (elapsed / (TEST_SECONDS * 1000)) * 100;
			$('#elapsed').height(pctElapsed + '%');
		}
	}
	
	var endTest = function()
	{
		clearTimeout(timerId);
		var numCorrect = $('#questions').find('.correct').length;
		$('#results').css('display', 'block');
		$("#results > div").html('Done!\n' + numCorrect + ' of ' + NUM_QUESTIONS + ' correct');
	};
	
	var returnToStartup = function()
	{
		$('#results').css('display', 'none');
		$('#return').css('visibility', 'hidden');
		$('#progress').css('visibility', 'hidden');
		$('#startup').css('display', 'block');
		$('.question').css('display', 'none');
		$('.submit').css('visibility', 'hidden');
		clearTimeout(timerId);
		
		$('.problem').each(function(index, item){
			resetProblem(item);
		});
	};
	
	var nextQuestion = function()
	{
		if(mode === Modes.TIMED && questionIndex >= 0)
		{
			$('#questions').find('div').eq(questionIndex).toggleClass('current');
		}
		
		questionIndex++;
		
		if(mode === Modes.TIMED)
		{
			if(questionIndex === NUM_QUESTIONS)
			{
				endTest();
			}
			else
			{
				$('#questions').find('div').eq(questionIndex).toggleClass('current');
			}
		}
		var oper = Math.floor(Math.random() * 4 + 1);
		var num1 = Math.floor(Math.random() * maxNumber + 1);
		var num2 = Math.floor(Math.random() * maxNumber + 1);
		var operator = '+';
		var ready = false;
		while(!ready)
		{
			ready = true;
			if(oper === 1 && (operations & Operations.ADDITION))
			{
				currentAnswer = num1 + num2;
			}
			else if(oper === 2 && (operations & Operations.SUBTRACTION))
			{
				num1 = Math.floor(Math.random() * maxSubtractionNumber + 1);
				num2 = Math.floor(Math.random() * maxSubtractionNumber + 1);
				var foo = num1;
				num1 = num1 + num2
				currentAnswer = foo;
				operator = '-';
			}
			else if(oper === 3 && (operations & Operations.MULTIPLICATION))
			{
				operator = '*';
			}
			else if(oper === 4 && (operations & Operations.DIVISION))
			{
				operator = '/';
			}
			else
			{
				oper = Math.floor(Math.random() * 4 + 1);
				ready = false;
			}
		}
		
		// transition out the old problem
		var problem = $('.problem').eq(currentProblemIndex);
		problem.toggleClass('problemActive', false);
		problem.toggleClass('problemOut', true);
		lastProblem = problem;
		setTimeout( function() { resetProblem(lastProblem.get(0)) }, 500);
		
		// initialize the next problem
		currentProblemIndex = (currentProblemIndex === 0 ? 1 : 0);
		problem = $('.problem').eq(currentProblemIndex);
		problem.find('.num1').text(num1);
		problem.find('.operator').text(operator);
		problem.find('.num2').text(num2);
		
		// transition in the new problem
		problem.css('-webkit-transition-duration','0.5s');
		problem.css('-moz-transition-duration','0.5s');
		problem.css('-o-transition-duration','0.5s');
		problem.css('-ms-transition-duration','0.5s');
		problem.css('transition-duration','0.5s');
		problem.toggleClass('problemActive', true);
	};
	
	var resetProblem = function(problem) {
		$(problem).css('-webkit-transition-duration','0s');
		$(problem).css('-ms-transition-duration','0s');
		$(problem).css('-o-transition-duration','0s');
		$(problem).css('-moz-transition-duration','0s');
		$(problem).css('transition-duration','0s');
		$(problem).toggleClass('problemOut', false);
		$(problem).toggleClass('problemActive', false);
	}
	
	var clearResponse = function()
	{
		$('.response').val('');
	};
	
	var responseUpdated = function(response)
	{
		var correct = parseInt(response) === currentAnswer;
		if(mode === Modes.TIMED)
		{
			var questions = $('#questions');
			questions.find('div').eq(questionIndex).toggleClass('next');
			questions.find('div').eq(questionIndex).toggleClass(correct ? 'correct' : 'incorrect');
		}
			
		if(correct || mode === Modes.TIMED)
		{
			clearResponse();
			nextQuestion();
		}
	};
	
	var isValidResponseKey = function(keyCode)
	{
		return (keyCode >= 48 && keyCode <= 57) || 
	  		 	(keyCode >= 96 && keyCode <= 105) ||
	  			keyCode === 27 || 
	  			keyCode === 8;

	};
	
	var init = function()
	{
		$('#next').click(nextQuestion);
		$('#practice').click(startPractice);
		$('#timed').click(startTimed);
		$('#return').click(returnToStartup);
		$('#done').click(returnToStartup);
		
		var response = $('.response');
	  
		// don't use keypress here because firefox doesn't yield a keycode
		response.keydown(function(event) {
		  return MF.isValidResponseKey(event.keyCode);
		});
	
		response.keyup(function(event) {
		  if (event.keyCode == '27') {
		     clearResponse();
		  }
		  else if(event.keyCode === 8)
		  {
		  	// do nothing
		  }
		  else if(event.keyCode === 13)
		  {
			if(mode === Modes.TIMED)
			{
				responseUpdated($(this).val());
			}
		  }
		  else // assuming only valid numeric input at this point
		  {
		  	if(mode !== Modes.TIMED)
			{
				responseUpdated($(this).val());
			}
		  }
		});
		
		response.change(function(event){
			responseUpdated($(this).val());
		});
		
		response.focus();
		
		$('#submit').click(function(event){
			responseUpdated($('#' + nextQuestionId).find('.response').val());
		});
	};
	
	return {
		nextQuestion: nextQuestion,
		clearResponse: clearResponse,
		responseUpdated: responseUpdated,
		isValidResponseKey: isValidResponseKey,
		init : init
	};

})();


$(document).ready(function(){
	
	// Run Matt Kersley's jQuery Responsive menu plugin (see plugins.js)
	if ($.fn.mobileMenu) {
		$('ol#id').mobileMenu({
			switchWidth: 768,                   // width (in px to switch at)
			topOptionText: 'Choose a page',     // first option text
			indentString: '&nbsp;&nbsp;&nbsp;'  // string for indenting nested items
		});
	}

	// Run Mathias Bynens jQuery placeholder plugin (see plugins.js)
	if ($.fn.placeholder) {
		$('input, textarea').placeholder();		
	}
	
	MF.init();
});
