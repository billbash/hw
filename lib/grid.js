// generate regions with environments and certain brick type percentages

// 1 portal to next level randomly placed at each level

// center of current level is reserved and cleaned

// "delimiters" for level center and player altars

Brick = require('./brick');
BRICK_TYPE= require('./constants').BRICK_TYPE;

function Grid(w, h) {
  this.w = w;
  this.h = h;
  
  this.bricks = [];
  
  for (var i = 0; i < w * h; i++) {
    this.bricks.push(new Brick(BRICK_TYPE.BLACK, i%w, Math.floor(i/w)));
  }
  
};

module.exports = exports = Grid;