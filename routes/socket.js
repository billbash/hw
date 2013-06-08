var names={}; //TODO make it a call to database with business class in lib
var tokens={};

exports.socket = function(app, sio) {
    sio.sockets.on('connection', function(socket) {
        console.log('A socket connected');
        
        socket.on('login', function(data) {
            var name = data.name;
            //if not alphanum, reject
            if (!name.match(/^[a-z0-9]+$/i) || name.length < 3) {
              socket.emit('error', {error: 'Name must only use allowed characters A-Za-z0-9 and be at least 3 characters long!'});
              return;
            }         
            //ensure unicity
            while (name in names) {
              name = name + Math.floor(Math.random()*10);
            }
            var token = require('crypto').createHash('sha1').update('site_secret928fjkl'+name).digest("hex"); //TODO make it app.site_secret
            names[name] = token;
            tokens[token] = name;
            console.log(names);
            console.log(tokens);
            socket.emit('logged', {name: name, token: token});
        });
        
        socket.on('disconnect', function() {
            console.log('A socket disconnected.');
        });
    });
};