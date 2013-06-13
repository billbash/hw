//TODO use socket.io namespace
//TODO save socket.id to be able to send to specific clients
//http://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js


// TEST (remove everything below for production)
var World = require('../lib/world');
var w = new World(11);
console.log (JSON.stringify(w.grid.bricks));



var names={}; //TODO make it a call to database with business class in lib
var tokens={};

exports.socket = function(app, sio) {
    sio.sockets.on('connection', function(socket) {
        console.log('A socket connected');
        
        socket.on('login', function(data) {
            var name = data.name;
            //if not alphanum, reject
            if (!name.match(/^[a-z0-9]+$/i) || name.length < 3 || name.length > 15) {
              socket.emit('error', {error: 'Name must only use allowed characters A-Za-z0-9 and be between 3 and 15 characters long!'});
              return;
            }         
            //ensure unicity
            while (name in names) {
              name = name + Math.floor(Math.random()*10);
            }
            var token = require('crypto').createHash('sha1').update('site_secret928fjkl'+name).digest("hex"); //TODO make it app.site_secret
            names[name] = token;
            tokens[token] = name;
            //console.log(names);
            //console.log(tokens);
            socket.emit('logged', {name: name, token: token});
        });
        
        socket.on('token auth', function(data) {
          if (data.hasOwnProperty('token') && tokens.hasOwnProperty(data.token)) {
            socket.emit('logged', {name: tokens[data.token], token: data.token});
          } else {
            socket.emit('expired token');
          }
          
        });
        
        socket.on('full update', function(data) {
          if (data.hasOwnProperty('token') && tokens.hasOwnProperty(data.token)) {
            socket.emit('full update', JSON.stringify(w));
          }
        });
        
        
        //TODO detect end of game
        //TODO add setInterval updates where bricks disappear
        //TODO make selected a property of player and not brick
        // and add current race position and (running total) score
        socket.on('clicked', function(data) {
          if (data.hasOwnProperty('token') && tokens.hasOwnProperty(data.token)) {
            if (data.x < w.size && data.y < w.size && w.grid.bricks[data.x + w.size * data.y] !== null) {
              
              for (var i = 0 ; i < w.size * w.size ; i++) {
                if (w.grid.bricks[i] && w.grid.bricks[i].selected == tokens[data.token]) {
                  return;
                }
              }
              if (!w.grid.bricks[data.x + w.size * data.y].selected) {
                w.grid.bricks[data.x + w.size * data.y].selected = tokens[data.token];
                sio.sockets.emit('full update', JSON.stringify(w));
              }
            }
          }
        });
        
        socket.on('disconnect', function() {
          //TODO remove player and everything player selected
            console.log('A socket disconnected.');
        });
    });
};