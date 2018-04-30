$(document).ready(function() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/events');
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var events = JSON.parse(xhr.responseText);
			renderEvents(events);
		}
	}
	xhr.send();
});

function renderEvents(events) {
	var car = $('#carousel');
	var spot = 'top';
	for (var i = 0; i < events.length; i++) {
		var obj = events[i];
		var newHTML = '<div class="slide' + spot + '"><div class="img_holder"><img src="' +
		              obj.url + '" alt="Event Poster"/></div><div class="info">' + 
		              '<p> <span class="eventtitle">' + obj.title + 
		              '<br/></span>Date: ' + obj.date + '<br/>' + 'Time: ' + obj.time + 
		              '<br/>' + 'Location: ' + obj.loc + '<br/><br/>' + obj.description + '<br/></p></div></div>';
		car.append(newHTML);
		if (spot === 'top') {
			spot = 'bottom';
		} else {
			spot = 'top';
		}
	}
}