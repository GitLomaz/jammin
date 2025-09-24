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
    this.load.image('paddleLeft', 'images/paddleLeft.png');
    this.load.image('paddleMiddle', 'images/paddleMiddle.png');
    this.load.image('paddleRight', 'images/paddleRight.png');
    this.load.spritesheet('blocks', 'images/blocks.png', { frameWidth: 53, frameHeight: 30 });
    this.load.json('level', 'js/data/' +  currentLevel[0] + '_' + currentLevel[1] + '.json');

  },

  create: function () {
    scene = this;
    jsonData = this.cache.json.get('level');
    this.blocks = this.add.group();
    this.balls = this.add.group();

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
      });
    });
  },  

  update: function (time) {
    this.paddle.update();
    this.balls.children.each((ball) => ball.update());
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

function generateLevel(jsonData) {
  console.log(jsonData);
  // MAP SIZE OPTIONS: 
  // X = 20 or 23 (spacing or no spacing in tiles)
  // Y = 12 or up to 17 (spacing on 12, none on others)
  for (let i = 0; i < jsonData.height; i++) {
    for (let j = 0; j < jsonData.width; j++) {
      const xSpacing = jsonData.width === 20? 60 : 53;
      const ySpacing = jsonData.height === 12? 40 : 30;
      const xMargin = jsonData.width === 20? 64 : 56;
      const yMargin = 70;
      let block = jsonData.layers[0].data.shift();
      switch (block) {
        case 0:
          continue;
        case 1:
        case 2:
        case 3:
        case 4:
          new StandardBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 1);
          break;
        case 5:
        case 6:
        case 7:
          new CrumbleBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 4);
          break;
      }
    }
  }
}