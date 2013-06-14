
var Auth = function() {
  this.tokens = {}; // tokens -> names
  this.names = {}; // names -> tokens
};

Auth.prototype.ok = function(data) {
  return data.hasOwnProperty('token') && this.tokens.hasOwnProperty(data.token);
};

Auth.prototype.login = function(data, socket) {
  var name = data.name;
  //if not alphanum, reject
  if (!name.match(/^[a-z0-9]+$/i) || name.length < 3 || name.length > 15) {
    socket.emit('error', {error: 'Name must only use allowed characters A-Za-z0-9 and be between 3 and 15 characters long!'});
    return;
  }         
  //ensure unicity
  while (name in this.names) {
    name = name + Math.floor(Math.random()*10);
  }
  var token = require('crypto').createHash('sha1').update('site_secret928fjkl'+name).digest("hex"); //TODO make it app.site_secret
  this.names[name] = token;
  this.tokens[token] = name;
  //console.log(names);
  //console.log(tokens);
  socket.emit('logged', {name: name, token: token});
};

Auth.prototype.token = function(data, socket) {
  if (this.ok(data)) {
    socket.emit('logged', {name: this.tokens[data.token], token: data.token});
  } else {
    socket.emit('expired token');
  }
};


module.exports = exports = Auth;