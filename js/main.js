let config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "wrapper",
  scene: [titleScene, gameScene, selectScene],
    physics: {
      default: 'matter',
      matter: {
        // debug: true,
        gravity: { y: 0, x: 0 }
      }
    },
};

const font = new FontFaceObserver('font1');

font.load().then(() => {
  // Font is loaded, now we can start the game
  game = new Phaser.Game(config);
}).catch((e) => {
  console.error('Font loading failed:', e);
  // Start the game anyway, but with a fallback font
  game = new Phaser.Game(config);
});
