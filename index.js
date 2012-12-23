/**
 * Module dependencies.
 */

var express = require('express'), 
	jade = require('jade'),
	app = express(), 
	config = require( __dirname + '/config/app.js'), 
	data = require( __dirname + '/lib/data'),
	stream = require( __dirname + '/lib/stream')
	http = require('http')
	server = http.createServer(app);

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

// load the stream
stream.init( data );

// export the app (to the server)
exports.app = server;
