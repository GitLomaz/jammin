let config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "wrapper",
  scene: [titleScene, gameScene],
    physics: {
    default: 'matter',
    matter: {
      debug: true
    }
  },
};

new Phaser.Game(config);