module.exports = function(app, sio) {
    sio.sockets.on('connection', function(socket) {
        console.log('A socket connected');
        
        socket.on('yeah', function() {
            console.log('yeah received');
        });
        
        socket.on('disconnect', function() {
            console.log('A socket disconnected.');
        });
    });
};