// login test

 function prompt_login() { 
   bootbox.prompt('Please provide a name:', function(name) {                
      if (!name) {                                              
        socket.emit('login', {name: 'guest'});
      } else {
        socket.emit('login', {name: name});                         
      }
    });
  }

socket = io.connect('');

socket.on('connect', function() {
    
    prompt_login();
    
    socket.on('error', function(data) {
      bootbox.alert('<b>'+data.error+'</b>');
    });
    
    socket.on('logged', function(data) {
      $('#logged_msg').text(data.name + ' ' + data.token);
    });
});
