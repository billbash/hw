

// Web Server Configuration
var server_port = process.env.PORT;// most OS's will require sudo to listen on 80
var server_address = process.env.IP;

// MongoDB Configuration
var mongo = require('mongodb');
var db = new mongo.Db('hw', new mongo.Server('ds029338.mongolab.com', 29338, {auto_reconnect : true, poolSize: 4}), {safe:true});


db.open(function(err, client) {
    client.authenticate('cloud9', 'cloud9', function(err, success) {
    var collection = new mongo.Collection(client, 'test_collection');
      collection.insert({hello: 'world'}, {safe:true},
                        function(err, objects) {
        if (err) return console.log(err.message);
      });
    });
});

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
