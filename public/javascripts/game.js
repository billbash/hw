// login test

LOCAL_STORAGE = {}; //for browsers with no local storage
function local_set(key, value) {
  if(localStorage) {
    localStorage[key] = value;
  } else {
    LOCAL_STORAGE[key] = value;
  }
}

function local_get(key) {
  if(localStorage) {
    return localStorage[key];
  } else {
    return LOCAL_STORAGE[key];
  }
}

function prompt_login() { 
 bootbox.prompt('Please provide a name:', function(name) {                
    if (!name) {                                              
      socket.emit('login', {name: 'guest'});
    } else {
      socket.emit('login', {name: name});                         
    }
  });
}

function send_server(key, data) {
  //adds authentication token to all emits
  data.token = local_get('token');
  socket.emit(key, data);
}


socket = io.connect('');

socket.on('connect', function() {
    
    // if client remembered authentication token locally, use it
    if (!local_get('token')) {
      prompt_login();
    } else {
      socket.emit('token auth', {token: local_get('token')});
    }
    
    // no auth
    socket.on('expired token', function() {
      prompt_login();
    });
    
    socket.on('error', function(data) {
      bootbox.alert('<b>'+data.error+'</b>');
    });
    
    socket.on('logged', function(data) {
      $('#logged_msg').text('Logged in as '+data.name);
      local_set('token', data.token);
    });
    
    // auth
    
    
    // drawing
    
    
    
    
});
