

// Web Server Configuration
var server_port = process.env.OPENSHIFT_INTERNAL_PORT; // most OS's will require sudo to listen on 80
var server_address = process.env.OPENSHIFT_INTERNAL_IP;

// MongoDB Configuration
var mongo_host = process.env.OPENSHIFT_MONGODB_DB_HOST;
var mongo_port = parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT, 10);
var mongo_user = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
var mongo_pass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

/**
 * Module dependencies.
 */

var express = require('express')
  , sockio = require('socket.io')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// CONFIGURATION

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

app.listen(server_port, server_address);
console.log("Express server listening");

//RUN SOCKET.IO
routes.socket(app, sio);
