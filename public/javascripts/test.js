// login test

socket = io.connect('');

socket.on('connect', function() {
    var name = prompt("Please enter your name!!");
    socket.emit('login', {name: name});
    
    socket.on('logged', function(data) {
      $('#logged_msg').text(data.msg);
    });
});
