/**
 * Module dependencies.
 */

var express = require('express'), 
	//util = require('util'),
	jade = require('jade'),
	fs = require('fs'),
	app = express.createServer(), 
	config = require(__dirname + '/config/app.js'), 
	data = require( __dirname + '/lib/data'),
	twitter = require('ntwitter');

// Configuration

app.configure(function(){
	app
	.set('views', __dirname + '/views')
	.set('view engine', 'jade')
	.set('view options', { layout: false })
	.use(express.static(__dirname + '/public'));
//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(app.router);
//  app.use(express.logger());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Emotiglobe',
	page: 'index'
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'Emotiglobe :: About',
	page: 'about'
  });
});

app.get('/data.json', function(req, res){
  
  var output = data.json();
  res.send( output );
  
});

var twit = new twitter({
  consumer_key: config.twitter.key,
  consumer_secret: config.twitter.secret,
  access_token_key: config.twitter.token_key,
  access_token_secret: config.twitter.token_secret
});

twit.stream('statuses/filter', {track:["happy", "sad"], 'locations':[-180, -90, 180, 90]}, function(stream) {
  stream.on('data', function ( stream ) {
    
		data.update( stream );
	  
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
});

// export the app (to the server)
exports.app = app;

