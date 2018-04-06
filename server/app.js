/* Require server dependencies. */
var express    = require('express');
var bodyparser = require('body-parser');
var validator  = require('validator');
var app = express();

/* Require and configure MongoDB. */
var mongoUri = process.env.MONGODB_URI  || 
               process.env.MONGOLAB_URI || 
               process.env.MONGOHQ_URL  || 
               'mongodb://localhost/comp20team3';
var mongo  = require('mongodb').MongoClient;
var format = require('util').format;
var db = mongo.connect(mongoUri, function(error, dbconnection) {
	db = dbconnection;
});

/* Set up app for use. */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

/*
 * Server routes to be implemented:
 * -- GET --
 * [X] Serve index.html
 * [ ] Serve admin login
 * [ ] Get events and information, including files
 * -- POST --
 * [ ] Submit an event
 * [ ] Remove an events
 * [ ] Admin - login
 * [ ] Admin - remove an event
 */

/* Get index.html. */
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

/* Get information on events, including posters. */
app.get('/events', function(req, res) {
	res.send('[]')
});

/* Submit an event. */
app.post('/submit', function(req, res) {
	var event = {
		"event": req.body.event
	}
	db.collection('events', function(error, coll) {
		coll.insert(event, function(error, saved) {
			if (error) {
				res.send(500);
			} else {
				res.send("Thanks for your submission!");
			}
		});
	});
});

/* Listen in on a port. */
app.listen(process.env.PORT || 3000);