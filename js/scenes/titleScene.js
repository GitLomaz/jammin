let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
    this.load.image('ball', 'images/ball.png');
    this.load.image('leaf1', 'images/leaf1.png');
    this.load.image('leaf2', 'images/leaf2.png');
    this.load.image('leaf3', 'images/leaf3.png');
    this.load.spritesheet('block', 'images/block.png', { frameWidth: 53, frameHeight: 30 });

    this.load.json('testData', 'images/test.json');

  },

  create: function () {
    scene = this;
    jsonData = this.cache.json.get('testData').layers[0].data;

    // Remove this once we get bottom.. kinda doing stuff
    this.matter.world.setBounds(
      0, 0, GAME_WIDTH, GAME_HEIGHT,
      128,  // thickness of the walls
      true, true, true, true // left, right, top, bottom enabled
    );

    this.blocks = this.add.group();

    // Loading JSON from Tiled object
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 16; j++) {
        let block = jsonData.shift();
        if (block === 0) continue;
        console.log(block - 1)
        new StandardBlock(64 + j * 60, 70 + i * 40, block - 1);
      }
    }

    this.platform = new Platform(this, GAME_WIDTH / 2, GAME_HEIGHT - 20, undefined);
    this.ball = new Ball(GAME_WIDTH / 2, (GAME_HEIGHT - 20) - 15);
    drawBoundaries();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        console.log('labels', labels);

        // Platform collisions
        if (labels.includes('platform')) {
          // Ball into Platform collision
          if (labels.includes('ball')) {
            const platform = labels[0] === 'platform' ? bodyA : bodyB;
            const ball = labels[0] === 'ball' ? bodyA : bodyB;

            const ballImpactX = ball.position.x;
            const platformImpactX = platform.position.x;
            const platformWidth = platform.gameObject.width;

            // NEGATIVE values means the ball hit the paddle on the LEFT side from the center
            // POSITIVE values means the ball hit the paddle on the RIGHT side from the center
            // The value ranges from [-(platformWidth / 2), +(platformWidth / 2)]
            const hitOffset = Math.floor(ballImpactX - platformImpactX);
            console.log('hitOffset', hitOffset);

            // TODO: Add logic to bounce the ball at an higher and higher angle depending on how far from the
            // center of the platform it was hit. Test also increasing velocity a bit by the same token.
          }
        }

        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject) {return}
          blockBody.gameObject.hit();
        }
      });
    });
  },  

  update: function (time) {
    this.platform.update();
    this.ball.update();
  },
});

function drawBoundaries() {
  const borderWidth = 10;
  const borderColor = 0x717171;

  // === Matter walls ===
  const options = { isStatic: true, isSensor: false, restitution: 1, friction: 0, frictionStatic: 0, frictionAir: 0 };

  // Top boundary
  scene.matter.add.rectangle(GAME_WIDTH / 2, borderWidth / 2, GAME_WIDTH, borderWidth, { ...options, label: 'top_wall' });

  // Left boundary
  scene.matter.add.rectangle(borderWidth / 2, GAME_HEIGHT / 2, borderWidth, GAME_HEIGHT, { ...options, label: 'left_wall' });

  // Right boundary
  scene.matter.add.rectangle(GAME_WIDTH - borderWidth / 2, GAME_HEIGHT / 2, borderWidth, GAME_HEIGHT, { ...options, label: 'right_wall' });

  // === Optional: still draw lines for visuals ===
  const g = scene.add.graphics();
  g.lineStyle(borderWidth, borderColor);

  // top
  g.moveTo(0, borderWidth / 2);
  g.lineTo(GAME_WIDTH, borderWidth / 2);

  // left
  g.moveTo(borderWidth / 2, 0);
  g.lineTo(borderWidth / 2, GAME_HEIGHT);

  // right
  g.moveTo(GAME_WIDTH - borderWidth / 2, 0);
  g.lineTo(GAME_WIDTH - borderWidth / 2, GAME_HEIGHT);

  g.strokePath();
  g.setScrollFactor(0);
}