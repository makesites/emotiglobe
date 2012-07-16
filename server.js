/**
 * Module dependencies.
 */

var app = require(__dirname + '/index').app, 
	config = require(__dirname + '/config/app.js');
	
// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port);
}
