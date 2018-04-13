/* Require server dependencies. */
var express    = require('express');
var bodyparser = require('body-parser');
var validator  = require('validator');
var aws        = require('aws-sdk');
var app = express();

/* Require and configure MongoDB. */
var mongoUri = 'mongodb://' + 
               process.env.DBUSER + ':' + process.env.DBPASS + 
               '@ds227565.mlab.com:27565/tuftsevents'
var mongo  = require('mongodb').MongoClient;
var format = require('util').format;
var db = mongo.connect(mongoUri, function(error, dbconnection) {
	db = dbconnection;
});

/* Set up app for use. */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/client'));
app.use(express.static(path.join(__dirname, 'client')));

// /* Set up AWS for image storage. */
// var s3 = new aws.S3();
// var bucket = new aws.S3({
// 	params: {
// 		Bucket: 'tuftswall'
// 	}
// });

/*
 * Server routes to be implemented:
 * -- GET --
 * [X] Serve index.html
 * [ ] Serve admin login
 * [X] Get events and information
 * -- POST --
 * [-] Submit an event
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
	db.collection('events', function(error, coll) {
		coll.find().toArray(function(error, results) {
			if (error) {
				res.send(500);
			} else {
				res.send(results);
			}
		});
	});
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
				res.send(200);
			}
		});
	});
});

/* Listen in on a port. */
app.listen(process.env.PORT || 3000);