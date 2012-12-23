/**
 * Module dependencies.
 */

var express = require('express'), 
	app = express(), 
	config = require( __dirname + '/config/app.js'), 
	data = require( __dirname + '/lib/data'),
	stream = require( __dirname + '/lib/stream')
	http = require('http')
	server = http.createServer(app),
	hbs = require('hbs');

// Configuration

app.configure(function(){
	app
	.set('views', __dirname + '/views')
	.set('view engine', 'html')
	.engine("html",  require('hbs').__express )
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

// configure handlebars

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
	
    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

// load the stream
stream.init( data );

// export the app (to the server)
exports.app = server;
