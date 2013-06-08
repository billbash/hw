// login test
NAME="";
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
      NAME = data.name;
    
    
      // drawing
          // create an new instance of a pixi stage
      var interactive = true;
      var stage = new PIXI.Stage(0xF0F0F0, interactive);
   
      // create a renderer instance.
      var renderer = PIXI.autoDetectRenderer(400, 300);
   
      // add the renderer view element to the DOM
      document.body.appendChild(renderer.view);
      
      var texture = PIXI.Texture.fromImage("/images/bunny.png");
      
      var bunny = {};
      bunny[NAME] = new PIXI.Sprite(texture);
      stage.addChild(bunny[NAME]);
      
      var texts = {};
      texts[NAME] = new PIXI.Text(NAME, {font:"12px Arial", fill:"black"});
      stage.addChild(texts[NAME]);
      
      requestAnimFrame( animate );
   
      function animate() {
          requestAnimFrame( animate );
          // render the stage   
          renderer.render(stage);
      }
      
      //TODO remove cursor when on canvas
      
      $('canvas').mousemove(function(e){
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        $('#status').html(x +', '+ y);
        
        send_server('mouse move', {x:x,y:y});
     }); 
      
      socket.on('play', function(data){
        console.log(data.name + ' ' + data.x + ' ' + data.y);
        if (!(data.name in bunny)) {
          bunny[data.name] = new PIXI.Sprite(texture);
          stage.addChild(bunny[data.name]);
          texts[data.name] = new PIXI.Text(data.name, {font:"12px Arial", fill:"black"});
          stage.addChild(texts[data.name]);
        }
        bunny[data.name].position.x = data.x;
        bunny[data.name].position.y = data.y;
        texts[data.name].position.x = data.x;
        texts[data.name].position.y = data.y;
      });
    });
    
});
