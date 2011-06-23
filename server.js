/**
 * Module dependencies.
 */

var express = require('express'), 
	app = module.exports = express.createServer(), 
	config = require('./config/app.js'), 
	TwitterNode = require('twitter-node').TwitterNode;
	//aws = require('node-aws');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
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
    title: 'Home'
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});


// Twitter Node
// you can pass args to create() or set them on the TwitterNode instance
var twit = new TwitterNode({
  user: config.twitter_user, 
  password: config.twitter_pass,
  //track: ["I'm happy", "I feel happy", "it's sad", "it's really sad"],
  track: ["happy", "sad"],
  locations: [-180, -90, 180, 90]
});

// http://apiwiki.twitter.com/Streaming-API-Documentation#QueryParameters
//twit.params['count'] = 100;

twit.headers['User-Agent'] = 'emotiglobe.com';

// Make sure you listen for errors, otherwise
// they are thrown
twit.addListener('error', function(error) {
  console.log(error.message);
});

twit
  .addListener('tweet', function(tweet) {
	var str = tweet.text;
	if(tweet.coordinates.coordinates[0] != null){
		var lat = Math.round(tweet.coordinates.coordinates[0]);
	}
	if(tweet.coordinates.coordinates[1] != null){
		var lng = Math.round(tweet.coordinates.coordinates[1]);
	}
	if( str.search("happy") && lat != null && lng != null ) { 
		console.log("Happy: " + lat +", "+ lng );
	}
	if( str.search("sad") && lat != null && lng != null ) { 
		console.log("Sad: " + lat +", "+ lng );
	}
	//console.log("Tweet: ", tweet.text );
	//console.log("Tweet: ", tweet.coordinates );
  })

  .addListener('limit', function(limit) {
	console.log("LIMIT: " + sys.inspect(limit));
  })

  .addListener('delete', function(del) {
	console.log("DELETE: " + sys.inspect(del));
  })

  .addListener('end', function(resp) {
	console.log("wave goodbye... " + resp.statusCode);
  })

  .stream();


// This will reset the stream
twit.stream();
	

// AWS 
/*
var client = aws.createClient({
  accessKeyId: '...',
  secretAccessKey: '...',
});

aws.request('simpleDb', 'putAttributes', {
  domainName: "test",
  itemName: "item1",
  attributes: [
    {
      name: 'key1',
      value: 'val1',
    },
  ],
}, function(response) {
  if (response instanceof Error) {
    // uh oh
    console.log(response.code, response.message);
  } else {
    // it worked!
  }
}); 
*/

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port);
  console.log("Express server listening on port %d", app.address().port);
}
