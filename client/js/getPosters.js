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
		var hour = parseInt(obj.time.substring(0, 2));
		var minute =  parseInt(obj.time.substring(3, 5));
		var amOrPm = (hour > 11) ? "PM" : "AM";

		if (hour > 12) {
		    hour -= 12;
		} else if (hour == 0) {
		    hour = "12";
		}

		if (minute < 10) {
		    minute = "0" + minute;
		}

		var imgHTML = '<img src="' + obj.url + '" alt="Event Poster" />';
		var pageHTML = '';
		if (obj.page != '') {
			var pageHTML = 'Link: <a href="' + obj.page + '">Click here!</a><br/>';
		}
		var newHTML = '<div class="slide' + spot + '"><div class="img_holder">' +
					  imgHTML + '</div><div class="info">' + 
		              '<p> <span class="eventtitle">' + obj.title + 
		              '<br/></span>' + pageHTML + 'Date: ' + monthNames[parse_date.getMonth()] + ' '
		              + (parse_date.getDate() + 1) + ', ' + parse_date.getFullYear() + '<br/>' 
		              + 'Time: ' + hour + ':' + minute + ' ' + amOrPm +
		              '<br/>' + 'Location: ' + obj.loc + '<br/><br/>' + obj.description + '<br/></p></div></div>';
		              
		car.append(newHTML);
		if (spot === 'top') {
			spot = 'bottom';
		} else {
			spot = 'top';
		}
	}
}