function init(){ 
	// if no WebGL do nothing (leave placeholder text)
	if (!Detector.webgl) return;
	//Detector.addGetWebGLMessage();
	
	var years = ['1990','1995','2000'];
	var container = document.getElementById('container');
	// empty container from the placeholder content before we continue...
	container.innerHTML = "";
	var globe = new DAT.Globe(container, function(label) {
	return new THREE.Color([
	  0xEEEEEE, 0xFF0000, 0x00FF00][label]);
	});
	
	var i, tweens = [];
	
	var settime = function(globe, t) {
	return function() {
	  new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
	  /*var y = document.getElementById('year'+years[t]);
	  if (y.getAttribute('class') === 'year active') {
		return;
	  }
	  var yy = document.getElementsByClassName('year');
	  for(i=0; i<yy.length; i++) {
		yy[i].setAttribute('class','year');
	  }
	  y.setAttribute('class', 'year active');*/
	};
	};
	/*
	for(var i = 0; i<years.length; i++) {
	var y = document.getElementById('year'+years[i]);
	y.addEventListener('mouseover', settime(globe,i), false);
	}
	*/
	var xhr;
	TWEEN.start();
	
	
	xhr = new XMLHttpRequest();
	xhr.open('GET', '/data.json', true);
	xhr.onreadystatechange = function(e) {
	if (xhr.readyState === 4) {
	  if (xhr.status === 200) {
		console.log(xhr.responseText);
		var data = JSON.parse(xhr.responseText);
		window.data = data;
		for (i=0;i<data.length;i++) {
		  globe.addData(data[i][1], {format: 'legend', name: data[i][0], animated: true});
		}
		globe.createPoints();
		settime(globe,0)();
		globe.animate();
	  }
	}
	};
	xhr.send(null);

}

function slider() {
	// get today's date
	var today = new Date(); // looks like: Mon Dec 24 2012 17:58:26 GMT-0800 (PST) 
	// var today = new Date(2012, 01, 05, 00, 00, 00, 00);
	
	// get year from today's date
	var year = today.getFullYear(); // looks like 2012
	
	// get the day number of the year for todays date
	var dateAsDayNumber = dateToDayNumber(today); // looks like 359
	
	// setup the slider
	initializeSlider(year, dateAsDayNumber);
	
		function initializeSlider(year, dateAsDayNumber) {
			// get the width of the slider input
			var sliderWidth = $('#slider input').width();
			// set the amount to multiply the date display position
			var multiplier = sliderWidth / dateAsDayNumber;
			var newdate = getSliderDate(year, dateAsDayNumber);
	
			// set the number of steps, max and value in slider to today
			$('#slider input')
						.attr('max', dateAsDayNumber)
						.attr('value', dateAsDayNumber)
						.attr('steps', dateAsDayNumber);
			// set the position of the slider date display
			$('#slider .date').css("left", dateAsDayNumber * multiplier +"px" );
			// update the date display
			updateSliderDate(year, dateAsDayNumber); 
	}
	
	// monitor slider change and update slider date
	$('#slider input').change(function() {
		var currentDay = ($(this).val());
		updateSliderDate(year, currentDay);
	});
	
	function updateSliderDate(year, date) {
		var newdate = getSliderDate(year, date);
	
		var day = newdate.getDate();
		var mon = newdate.getMonth() + 1;
		var year = newdate.getFullYear();
		var pretty = mon + "-" + day + "-" + year;
		var sliderWidth = $('#slider input').width();
		var multiplier = sliderWidth / dateAsDayNumber;
		$('#slider .date').html(pretty);
		$('#slider .date').css("left", date * multiplier +"px" );
	}
   
	
	
	
	function getSliderDate(year, day) {
		var dfd = dateFromDay(year, day); // looks like Mon Dec 24 2012 00:00:00 GMT-0800 (PST) 
		return(dfd);
	}
	

	// converts day of year (ie 359) to a date
	function dateFromDay(year, day) {
		var date = new Date(year, 0); // initialize a date in `year-01-01`
		return new Date(date.setDate(day)); // add the number of days
	}

	// returns date today as a number (ie 359)
	function dateToDayNumber(date) {
    	var feb = daysInFebruary(date.getFullYear());
    	var aggregateMonths = [0, // January
                           31, // February
                           31 + feb, // March
                           31 + feb + 31, // April
                           31 + feb + 31 + 30, // May
                           31 + feb + 31 + 30 + 31, // June
                           31 + feb + 31 + 30 + 31 + 30, // July
                           31 + feb + 31 + 30 + 31 + 30 + 31, // August
                           31 + feb + 31 + 30 + 31 + 30 + 31 + 31, // September
                           31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
                           31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
                           31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
                         ];
    	return aggregateMonths[date.getMonth()] + date.getDate();
	}

	// works out how many days in Feb for current year
	function daysInFebruary(year) {
    	if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        	// Leap year
        	return 29;
    	} else {
        	// Not a leap year
        	return 28;
    	}
	}
}