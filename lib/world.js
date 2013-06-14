

// RULE 1: Only one thing (player, object, animal, building) per square ;
// when two things conflict, one stops or disappears and both might be hurt
// "delimiters" don't count

// RULE 2: all recipes can be made, the world generates missing bricks
// accordingly

// RULE 3: ALL recipes are randomized and specific to a given world

// RULE 4: There is at least one portal from level n to level n+1 (but not the
// opposite making it adventurous to progress for new materials)

// RULE 5: Once a level center has ascended to heaven, all players are rewarded
// and a brand new world is created

// RULE 6: Recipes inside delimiters are evaluated every 10 seconds and might 
// trigger chain reactions!

var Grid = require('./grid');

var World = function(size){
  this.size = size;
  this.grid = new Grid(size, size); // grid of bricks
  this.race_scores = [];
  this.total_scores = {};
};

World.prototype.reset = function () {
  this.grid = new Grid(this.size, this.size); // grid of bricks
};

World.prototype.computeScores = function() {
  
  for (var i=0; i < this.race_scores.length; i++) {
    for (var player in this.race_scores[i]) {
      if (!(player in this.total_scores))
        this.total_scores[player] = this.race_scores[i][player];
      else
        this.total_scores[player] += this.race_scores[i][player];
    } 
  }
  //console.log(this.total_scores);
  
  this.race_scores = [];
};

World.prototype.removeBricks = function(nonselected) {
  var num_to_remove = Math.floor(Math.random() * 5) + 1;
        while (nonselected.length !== 0 && num_to_remove > 0) {
          var index = Math.floor(Math.random() * nonselected.length);
          this.grid.bricks[nonselected[index]] = null;
          nonselected.splice(index, 1);
          num_to_remove--;
        }
};

World.prototype.clicked = function(data, tokens, sio) {
  if (data.x < this.size && data.y < this.size && this.grid.bricks[data.x + this.size * data.y] !== null) {             
    for (var i = 0 ; i < this.size * this.size ; i++) {
      if (this.grid.bricks[i] && this.grid.bricks[i].selected == tokens[data.token]) {
        return;
      }
    }
    if (!this.grid.bricks[data.x + this.size * data.y].selected) {
      this.grid.bricks[data.x + this.size * data.y].selected = tokens[data.token];
      var e = {};
      e[tokens[data.token]] = this.race_scores.length+1;         
      this.race_scores.push(e); // TODO special bricks?
      sio.sockets.emit('full update', JSON.stringify(this));
    }
  }
};

World.prototype.update = function(sio) {
  return function() {
    // save all non selected bricks index in a list
    var nonselected = [];
    for (var i=0; i < this.size*this.size; i++) {
      if (this.grid.bricks[i] && this.grid.bricks[i].selected===false) {
        nonselected.push(i);
      }
    }
    //console.log(nonselected);
    // remove one non selected brick randomly
    if (nonselected.length !== 0) {
      this.removeBricks(nonselected);
      sio.sockets.emit('full update', JSON.stringify(this));
    } else { //end of game, add to total scores, reset racescores, reset grid
      this.computeScores();
      //console.log ("END OF GAME");
      this.reset();
      sio.sockets.emit('full update', JSON.stringify(this));
      
      //wait 3 secondes
      clearInterval(interval);
      var w = this;
      setTimeout(function() {
        interval = setInterval(w.update(sio).bind(w), 1000);
      }, 3000);
    }
  };
};

module.exports = exports = World;