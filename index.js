/**
 * Module dependencies.
 */

var express = require('express'), 
	util = require('util'),
	jade = require('jade'),
	fs = require('fs'),
	app = express.createServer(), 
	config = require(__dirname + '/config/app.js'), 
	data = {},
	emotiglobe = require( __dirname + '/lib/emotiglobe'),
	twitter = require('ntwitter');

var current_date = emotiglobe.get_date();

//process.env['APP_DIR'] = __dirname;

//emotiglobe.check_dir();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
  
  var output = emotiglobe.get_json( data );
  
  res.send( output );
  //res.send( JSON.stringify(output) );
});

// Twitter Node
// you can pass args to create() or set them on the TwitterNode instance

/*var twit = new TwitterNode({
  user: config.twitter_user, 
  password: config.twitter_pass,
  //track: ["I'm happy", "I feel happy", "it's sad", "it's really sad"],
  //track: ["m happy", "m sad"],
  track: [":)", ":("],
  locations: [-180, -90, 180, 90]
});*/

var twit = new twitter({
  consumer_key: config.twitter.key,
  consumer_secret: config.twitter.secret,
  access_token_key: config.twitter.token_key,
  access_token_secret: config.twitter.token_secret
});

//twit.headers['User-Agent'] = 'emotiglobe.com';
/*
twit.verifyCredentials(function (err, data) {
    //console.log(data);
  });*/

twit.stream('statuses/filter', {track:["happy", "sad"], 'locations':[-180, -90, 180, 90]}, function(stream) {
  stream.on('data', function (data) {
    
	  // reset the data every day
	  var date = emotiglobe.get_date();
	  if( date != current_date ){ 
		data = emotiglobe.reset_data( current_date, data );
		current_date = date;
	  } else {
		data = emotiglobe.update_data( stream, data);
	  } 
	  
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
});

// Make sure you listen for errors, otherwise
// they are thrown
/*twit.addListener('error', function(error) {
  console.log(error.message);
});*/

/*twit
  .addListener('tweet', function(tweet) {

	  // reset the data every day
	  var date = emotiglobe.get_date();
	  if( date != current_date ){ 
		data = emotiglobe.reset_data( current_date, data );
		current_date = date;
	  } else {
		data = emotiglobe.update_data( tweet, data);
	  } 
  })

  .addListener('limit', function(limit) {
	//console.log("LIMIT: " + util.inspect(limit));
  })

  .addListener('delete', function(del) {
	console.log("DELETE: " + util.inspect(del));
  })

  .addListener('end', function(resp) {
	console.log("wave goodbye... " + resp.statusCode);
  });
  
// initiate the stream
twit.stream();
*/

// Only listen on $ node app.js
module.exports = app;
  //console.log("Express server listening on port %d", app.address().port);
//}
