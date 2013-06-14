// GLOBALS
NAME="";
BRICK_TYPE_TO_COLOR = {BLACK: 0xFFFFFF};
BRICK_SIZE = 32;
WORLD = {};
LOCAL_STORAGE = {}; //for browsers with no local storage

// HELPER FUNCTIONS
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

function redraw(s, t) {
  // Grid
  var w = WORLD;
  s.graphics.clear();
  for (var i = 0; i < w.size * w.size; i++) {
    if (w.grid.bricks[i] !== null) {
      var color = BRICK_TYPE_TO_COLOR[w.grid.bricks[i]];
      if (w.grid.bricks[i].selected) {
        if (w.grid.bricks[i].selected == NAME)
          color = 0x0000FF;
        else
          color = 0xFF0000;
      }
      s.graphics.beginFill(color, 1);
      s.graphics.drawRect(BRICK_SIZE * (i%w.size), BRICK_SIZE * Math.floor(i/w.size), BRICK_SIZE-1, BRICK_SIZE-1);
    }
  }
  // Scores
  //TODO sort by score, remove "You are foobar", make player a different color, limit results to top 15
  t.text = '';
  for (var player in w.total_scores) {
    t.text += player + ' ' + w.total_scores[player] + '\n';
    t.width = t.textWidth; t.height = t.textHeight;
  }
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
      bootbox.alert('<b>'+data.error+'</b>', function() {
        window.location.reload();
      });
    });
    
    // authenticated
    socket.on('logged', function(data) {
      
      $('#logged_msg').html('You are <b>'+data.name+'</b>');
      local_set('token', data.token);
      NAME = data.name;
    
      //drawing
      //TODO rename s, f, t following global naming conventions
			var stage = new Stage("c");
      stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseClick);
			var s = new Sprite();
			stage.addChild(s);
      
      var f = new TextFormat("Verdana", 12, 0xdd8800, true);
      var t = new TextField();
      t.setTextFormat(f);
      t.text = "-------------------------------"; //TODO find out why '' won't work here
      t.x = BRICK_SIZE * 11 + 5;
      t.y = 0;
      t.width = t.textWidth; t.height = t.textHeight;
      stage.addChild(t);
      
      socket.on('full update', function(data) {
        WORLD = JSON.parse(data); 
        //console.log(WORLD);
        redraw(s, t);
      });     
      
      send_server('full update', {});	
      
      
      function onMouseClick(e) {
        
        var rect = document.getElementById('c').getBoundingClientRect();
        var coordX = Math.floor((stage.mouseX - rect.left) / BRICK_SIZE);
        var coordY = Math.floor((stage.mouseY - rect.top)/ BRICK_SIZE);
        
        send_server('clicked', {x:coordX, y:coordY});
      }
      
      
    });
    
});
