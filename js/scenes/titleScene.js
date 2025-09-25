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
<<<<<<< HEAD
  },
=======
    jsonData = this.cache.json.get('level' + JSON.stringify(currentLevel));
    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();

    generateLevel(jsonData);

    // Remove this once we get bottom.. kinda doing stuff
    this.matter.world.setBounds(
      0, 0, GAME_WIDTH, GAME_HEIGHT,
      128,  // thickness of the walls
      true, true, true, true // left, right, top, bottom enabled
    );

    this.paddle = new Paddle(GAME_WIDTH / 2, GAME_HEIGHT - 20);
    this.ball = new Ball(GAME_WIDTH / 2, (GAME_HEIGHT - 20) - 15);
    drawBoundaries();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;
          if (!blockBody || !blockBody.gameObject) {return}
          blockBody.gameObject.hit();
        }

        // PowerUp into Player collision
        if (labels.includes('paddle') && labels.includes('powerUp')) {
          const powerUp = labels[0] === 'powerUp' ? bodyA : bodyB;
          powerUp.gameObject.collect();
        }
      });
    });
  },  
>>>>>>> 735f2120d62c08ed84b0ab5c5752b7de15cdc0fd

  update: function (time) {
  },
});
