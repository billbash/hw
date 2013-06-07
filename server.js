// Configuration
var server_port = process.env.PORT;
var server_address = process.env.IP;

// MongoDB Configuration
var mongoose = require('mongoose');
mongoose.connect('mongodb://cloud9:cloud9@ds029338.mongolab.com:29338/hw',
  function(err) {
    if (err) { throw err; }
});

/*
var CommentaireArticleModel = require('./models/commentaire');

// On créé une instance du Model
var monCommentaire = new CommentaireArticleModel({ pseudo : 'Linus' });
monCommentaire.contenu = 'Salut, super article sur Mongoose hey !';

// On le sauvegarde dans MongoDB !
monCommentaire.save(function (err) {
  if (err) { throw err; }
  console.log('Commentaire ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});
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
