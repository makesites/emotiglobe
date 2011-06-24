/**
 * Module dependencies.
 */

var express = require('express'), 
	
	app = module.exports = express.createServer(), 
	config = require('./config/app.js'), 
	data = {},
	emotiglobe = require('./lib/emotiglobe'),
	TwitterNode = require('twitter-node').TwitterNode;
	//aws = require('node-aws');

var current_date = emotiglobe.get_date();

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
  
  var output = emotiglobe.create_json( data, current_date);
  
  res.send( output );
  //res.send( JSON.stringify(output) );
});

// Twitter Node
// you can pass args to create() or set them on the TwitterNode instance
var twit = new TwitterNode({
  user: config.twitter_user, 
  password: config.twitter_pass,
  //track: ["I'm happy", "I feel happy", "it's sad", "it's really sad"],
  track: ["m happy", "m sad"],
  locations: [-180, -90, 180, 90]
});

twit.headers['User-Agent'] = 'emotiglobe.com';

// Make sure you listen for errors, otherwise
// they are thrown
twit.addListener('error', function(error) {
  console.log(error.message);
});

twit
  .addListener('tweet', function(tweet) {
	data = emotiglobe.update_data( tweet, data);
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
