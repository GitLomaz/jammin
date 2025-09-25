let config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "wrapper",
  scene: [gameScene, titleScene],
    physics: {
      default: 'matter',
      matter: {
        // debug: true,
        gravity: { y: 0, x: 0 }
      }
    },
};

new Phaser.Game(config);