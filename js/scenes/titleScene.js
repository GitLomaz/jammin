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
    this.load.image('block', 'images/block.png');

    this.load.json('testData', 'images/test.json');

    // this.input.on(
    //   'pointerdown',
    //   (pointer, objectsClicked) => {   
    //     console.log(objectsClicked);
    //     this.matter.add.gameObject(new Leaf(500, 200));
    //     this.add.sprite(300, 300, 'rectangle');
    //   }
    // );

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
        new StandardBlock(64 + j * 60, 70 + i * 40, 0);
      }
    }

    this.platform = new Platform(this, 516, 700, undefined);
    this.ball = new Ball(500, 650);
    drawBoundaries();

     this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
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
    this.platform.update();
    this.ball.update();
  },
});

function drawBoundaries() {
  const borderWidth = 10;
  const borderColor = 0x717171;

  // === Matter walls ===
  const options = { isStatic: true, restitution: 1, friction: 0, frictionStatic: 0, frictionAir: 0 };

  // Top boundary
  scene.matter.add.rectangle(GAME_WIDTH / 2, borderWidth / 2, GAME_WIDTH, borderWidth, options);

  // Left boundary
  scene.matter.add.rectangle(borderWidth / 2, GAME_HEIGHT / 2, borderWidth, GAME_HEIGHT, options);

  // Right boundary
  scene.matter.add.rectangle(GAME_WIDTH - borderWidth / 2, GAME_HEIGHT / 2, borderWidth, GAME_HEIGHT, options);

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