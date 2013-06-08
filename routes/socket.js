exports.socket = function(app, sio) {
    sio.sockets.on('connection', function(socket) {
        console.log('A socket connected');
        
        socket.on('login', function(data) {
            var msg = 'Hello ' + data.name;
            console.log(msg);
            socket.emit('logged', {msg: msg});
        });
        
        socket.on('disconnect', function() {
            console.log('A socket disconnected.');
        });
    });
};