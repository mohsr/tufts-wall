/* Require server dependencies. */
var express    = require('express');
var path       = require('path');
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
app.use(express.static(path.join(__dirname, 'client')));

var bucket = process.env.S3_BUCKET;

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

/* Event submission page. */
app.get('/submit', function(req, res) {
	res.sendFile(__dirname + '/client/submission.html');
});

/* Get a signed URL for image submission. */
app.get('/storage-get', function(req, res) {
	/* Create the parameters. */
	const s3 = new aws.S3();
	const fname = req.query.fname;
	const ftype = req.query.ftype;
	const s3params = {
		Bucket: bucket,
		Key: fname,
		Expires: 60,
		ContentType: ftype,
		ACL: 'public-read'
	};

	/* Get an AWS S3 signed URL for the client to upload to. */
	s3.getSignedUrl('putObject', s3params, function(error, data) {
		if (error) {
			res.send(500);
		} else {
			const returned = {
				signedRequest: data,
				url: ('https://' + bucket + '.s3.amazonaws.com/' + fname)
			};
			res.header("Content-Type", "application/json");
			res.write(JSON.stringify(returned));
			res.end();
		}
	});
});

app.post('/storage-submit', function(req, res) {
	res.send(req.body);
});

/* Listen in on a port. */
app.listen(process.env.PORT || 3000);