let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
    console.log('preloading')
    console.log(currentLevel)
    this.load.image('ball', 'images/hotBall.png');
    this.load.image('leaf1', 'images/leaf1.png');
    this.load.image('leaf2', 'images/leaf2.png');
    this.load.image('leaf3', 'images/leaf3.png');
    this.load.image('paddleLeft', 'images/paddleLeft.png');
    this.load.image('paddleMiddle', 'images/paddleMiddle.png');
    this.load.image('paddleRight', 'images/paddleRight.png');
    this.load.image('iron', 'images/iron.png');
    this.load.image('ironLeft', 'images/ironLeft.png');
    this.load.image('ironRight', 'images/ironRight.png');
    this.load.image('portal', 'images/portal.png');
    this.load.image('bg', 'images/bg.png');
    this.load.spritesheet('blocks', 'images/blocks.png', { frameWidth: 53, frameHeight: 30 });
    this.load.json('level' + JSON.stringify(currentLevel), 'js/data/' +  currentLevel[0] + '_' + currentLevel[1] + '.json');
  },

  create: function () {
    scene = this;
    jsonData = this.cache.json.get('level' + JSON.stringify(currentLevel));
    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();

    // background
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);

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
    this.portals.children.each((portal) => portal.update());
    let anyBreakableLeft = false;
    this.blocks.children.each((block) => {
      if (block.breakable) {
        anyBreakableLeft = true;
      }
    });

    if (!anyBreakableLeft) {
      generatePortals();
    }
  },
});

function drawBoundaries() {
  const borderWidth = 30;

  // === Matter walls ===
  const options = { isStatic: true, isSensor: false, restitution: 1, friction: 0, frictionStatic: 0, frictionAir: 0 };

  // Top boundary
  scene.matter.add.rectangle(
    GAME_WIDTH / 2,
    borderWidth / 2,
    GAME_WIDTH,
    borderWidth,
    { ...options, label: 'top_wall' }
  );
  scene.add.tileSprite(
    GAME_WIDTH / 2,
    borderWidth / 2,
    GAME_WIDTH + 46,
    borderWidth,
    'iron'
  );

  // Left boundary
  scene.matter.add.rectangle(
    borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    { ...options, label: 'left_wall' }
  );
  scene.add.tileSprite(
    borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    'ironLeft'
  );

  // Right boundary
  scene.matter.add.rectangle(
    GAME_WIDTH - borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    { ...options, label: 'right_wall' }
  );
  scene.add.tileSprite(
    GAME_WIDTH - borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    'ironRight'
  );
}

function generatePortals() {
  if (scene.portals.children.size === 0) {
    new Portal(15, GAME_HEIGHT - 42);
    new Portal(GAME_WIDTH - 15, GAME_HEIGHT - 42);
  }
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
        case 9:
        case 10:
        case 11:
          new StandardBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 1);
          break;
        case 5:
        case 6:
        case 7:
          new CrumbleBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 4);
          break;
        case 8:
          new IronBlock(xMargin + j * xSpacing, yMargin + i * ySpacing);
          break;
      }
    }
  }
}