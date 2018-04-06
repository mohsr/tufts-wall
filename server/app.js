/* Require server dependencies. */
var express    = require('express');
var bodyparser = require('body-parser');
var validator  = require('validator');
var app = express();

/* Require and configure MongoDB. */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

/* Set up app for use. */
app.use(bodyparser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/* Routes for the serve. */
app.get('/', function(req, res) {
	res.send("<!doctype HTML><html><head><title>Comp20 Team3</title></head><body><p>Here's the site!</p></body></html>")
});

/* Listen in on a port. */
app.listen(process.env.PORT || 3000);