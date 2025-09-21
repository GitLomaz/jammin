let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
  },

  create: function () {
    scene = this;
    new Leaf(200, 200);
  },

  update: function (time) {
  },
});
