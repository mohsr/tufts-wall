/* Require server dependencies. */
var express    = require('express');
var path       = require('path');
var crypto     = require('crypto');
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
 * TODO:
 * Image file type (clientside?)
 * Mohsin - Admin Portal Login w/ Admin Pass
 * Mark events as "approved"
 * Edit GET /events so that only approved events are sent
 * Mohsin - Remove events
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
				res.sendStatus(500);
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
	/* Get an unused random array of hex chars. */
	var bytes = crypto.randomBytes(12).toString('hex');
	db.collection('ids', function(error, collection) {
		if (error) {
			return;
		} else {
			var arr = collection.find().toArray();
			while (arr.indexOf(bytes) === -1) {
				bytes = crypto.randomBytes(12).toString('hex');
			}
			collection.insert({id: bytes});
		}
	});
	/* Create the parameters with a "salted" filename for uniqueness. */
	const s3 = new aws.S3();
	const fname = bytes + req.query.fname;
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
			res.sendStatus(500);
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

/* Submit the event data to MongoDB. */
app.post('/storage-submit', function(req, res) {
	var ev_title = req.body.event_title;
	var ev_start = req.body.event_startdate;
	var ev_end   = req.body.event_enddate;
	var ev_text  = req.body.Text1;
	var ev_url   = req.body.url;

	if (ev_title == null || ev_start == null || ev_end == null || ev_text == null || ev_url == null) {
		res.sendStatus(500);
		return;
	} else {
		var data = {
			title: ev_title,
			start: ev_start,
			end:   ev_end,
			text:  ev_text,
			url:   ev_url
		}
		db.collection('events', function(error, collection) {
			collection.update({title: ev_title}, data, {upsert: true}, function(error, results) {
				if (error) {
					res.sendStatus(500);
				} else {
					res.sendStatus(200);
				}
			});
		});
	}
});

/* Listen in on a port. */
app.listen(process.env.PORT || 3000);
