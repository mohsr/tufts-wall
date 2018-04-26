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
	console.log('adding events');
	var car = $('#carousel');
	var spot = 'top';
	for (var i = 0; i < events.length; i++) {
		var obj = events[i];
		var newHTML = '<div class="img_holder"><div class="slide' + spot + '"><img src="' +
		              obj.url + '" alt="Event Poster"/><div class="info">' + 
		              '<p> <span class="eventtitle">' + obj.title + 
		              '<br/></span>Date: ' + obj.start + ' - ' + obj.end + 
		              '<br/>' + 'Location: ' + obj.loc + '<br/>' + obj.text + '<br/></p></div></div></div>';
		car.append(newHTML);
		if (spot === 'top') {
			spot = 'bottom';
		} else {
			spot = 'top';
		}
	}
}