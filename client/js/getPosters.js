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

		const monthNames = ["January", "February", "March", "April", "May", "June",
 							"July", "August", "September", "October", "November", "December"
						   ];
		var parse_date = new Date(Date.parse(obj.date));

		var imgHTML = '<img src="' + obj.url + '" alt="Event Poster"/>';
		if (obj.page != '') {
			imgHTML = '<a href="//' + obj.page + '">' + imgHTML + '</a>';
		}
		var newHTML = '<div class="slide' + spot + '"><div class="img_holder">' +
					  imgHTML + '</div><div class="info">' + 
		              '<p> <span class="eventtitle">' + obj.title + 
		              '<br/></span>Date: ' + obj.date + '<br/>' + 'Time: ' + monthNames[parse_date.getMonth()] + ' '
		              + parse_date.getDate() + ', ' + parse_date.getFullYear() +
		              '<br/>' + 'Location: ' + obj.loc + '<br/><br/>' + obj.description + '<br/></p></div></div>';
		car.append(newHTML);
		if (spot === 'top') {
			spot = 'bottom';
		} else {
			spot = 'top';
		}
	}
}