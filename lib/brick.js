
//BASIC BRICKS

// black brick: basic construction brick
// white brick: idem
// trash brick: no use, can be compacted (destroyed) for better access and mana
// grey brick: wall


// ARTICIFIAL BRICKS (must me made in foundry from recipes)

// diamond brick: highly compacted black bricks
// dynamite brick: used to break walls or as a grenade



// ELEMENTAL BRICKS (have effects on players, are hard to handle)

// sand brick: can be walked on, but too long and it kills
// water brick: cannot be thrown
// lava brick: kills unprotected players
// ice brick: goes on forever after throw (killing on its path!)
// toxic brick: loading a toxic brick randomly kills

// RARE BRICKS (appear only in certain environments, or certain levels)

// UNIQUE BRICKS

var Brick = function(t, x, y) {
  this.type = t; //type is also the brick color in 0xXXXXXX hexa rgb format
  this.x = x;
  this.y = y;
  
};


module.exports = exports = Brick;