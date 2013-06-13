//TODO replace PIXI.js with IvanK library

// login test
NAME="";
BRICK_TYPE_TO_COLOR = {BLACK: 0xFFFFFF};
BRICK_SIZE = 32;
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
      bootbox.alert('<b>'+data.error+'</b>', function() {
        window.location.reload();
      });
    });
    
    // authentified
    socket.on('logged', function(data) {
      
      
      
    
      
      $('#logged_msg').html('You are <b>'+data.name+'</b>');
      local_set('token', data.token);
      NAME = data.name;
    
      
      //drawing
			var stage = new Stage("c");
      stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseClick);
			var s = new Sprite();
			stage.addChild(s);
      
      
      socket.on('full update', function(data) {
        var w = JSON.parse(data);
        console.log(w);
        
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
        
      });
      
      send_server('full update', {});	
      
      
      function onMouseClick(e) {
        
        var rect = document.getElementById('c').getBoundingClientRect();
        var coordX = Math.floor((stage.mouseX - rect.left) / BRICK_SIZE);
        var coordY = Math.floor((stage.mouseY - rect.top)/ BRICK_SIZE);
        
        console.log(coordX);
        console.log(coordY);
        
        send_server('clicked', {x:coordX, y:coordY});
      }
      
			//  shapes
			/*for(var i=0; i<11*11; i++)
			{
				var color = Math.floor(Math.random()*2) === 0 ? 0x000000 : 0xFFFFFF;
				s.graphics.beginFill(color, 1);
				s.graphics.drawEllipse(70 * (i%11), 70 * Math.floor(i/11)+35, 70, 70);
			}*/
      
      // background
      /*
      var bd0 = new BitmapData('/images/asphalt.jpg');
      var b0 = new Bitmap(bd0);
      var b1 = new Bitmap(bd0);
      b1.x += 512;
      stage.addChild(b0);
      stage.addChild(b1);
      
      // bitmap
      var bd = new BitmapData('/images/racecarsalpha.png');
      var b = new Bitmap(bd);
      //b.scaleX = b.scaleY = 2.0;
      stage.addChild(b);
			*/
      
      
    });
    
});
