$(document).ready(function() {
    var info;
    $.get("API_URL_GOES_HERE", function(data, status) {
        info = JSON.parse(data);
    });
});
