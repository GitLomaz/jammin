let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
    this.load.image('ball', 'images/ball.png');
  },

  create: function () {
    scene = this;
    
this.matter.world.setBounds(
  0, 0, GAME_WIDTH, GAME_HEIGHT,
  32,  // thickness of the walls
  true, true, true, true // left, right, top, bottom enabled
);
    new Leaf(200, 200);
    new Ball(200, 150);
  },

  update: function (time) {
  },
});
