

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
};

module.exports = exports = World;