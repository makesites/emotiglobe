var express = require('express'),
    app = express.createServer();

//server.js#routes
app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen();
console.log('Express server started on port %s', app.address().port);
