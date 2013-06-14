//TODO use socket.io namespace
//TODO save socket.id to be able to send to specific clients
//http://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js

var World = require('../lib/world');
var AuthM = require('../lib/auth');
var Auth = new AuthM();
var w = new World(11); //TODO make it an app global?

exports.socket = function(app, sio) {
  
    // WORLD UPDATE FUNCTION
    interval = setInterval(w.update(sio).bind(w), 1000);
  
    sio.sockets.on('connection', function(socket) {
        console.log('A socket connected');
        
        // AUTH
        socket.on('login', function(data) {
          Auth.login(data, socket);
        });
        
        socket.on('token auth', function(data) {
          Auth.token(data, socket);
        });
        
        // GAME LOGIC
        socket.on('full update', function(data) {
          if (Auth.ok(data)) {
            socket.emit('full update', JSON.stringify(w));
          }
        });
        
        socket.on('clicked', function(data) {
          if (Auth.ok(data)) {
            w.clicked(data, Auth.tokens, sio);
          }
        });
        
        socket.on('disconnect', function() {
          //TODO remove player and everything player selected
            console.log('A socket disconnected.');
        });
    });
};