/**
 * Module dependencies.
 */

var app = require(__dirname + '/index');

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(config.port);
  //console.log("Express server listening on port %d", app.address().port);
}
