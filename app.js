
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , sockio = require('socket.io')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// URLS
app.get('/', routes.index);

// RUN SERVER
var sio = sockio.listen(app);
sio.set('log level', 1);

app.listen(process.env.PORT, process.env.IP);
console.log("Express server listening");

//RUN SOCKET.IO
require('./routes/socket')(app, sio);
