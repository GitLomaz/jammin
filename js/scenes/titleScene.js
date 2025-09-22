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

    this.platform = new Platform(this, 516, 700, undefined);
    
    this.matter.world.setBounds(
      0, 0, GAME_WIDTH, GAME_HEIGHT,
      128,  // thickness of the walls
      true, true, true, true // left, right, top, bottom enabled
    );

    for (let i = 0; i < 10; i++) {
      new Leaf(Random.between(100, 900), Random.between(100, 600));
      
    }

    this.ball = new Ball(200, 150);

    // new Phaser.Geom.Rectangle(1024, 720, 0, 0, 0xffffff);

    console.log(this.cameras.main.width, this.cameras.main.height);
    console.log(PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT);

    // let matterBlock = this.matter.add.sprite(100, 100, 'rectangle');
    // let sceneBlock = this.add.sprite(300, 100, 'rectangle');
    // let sceneCircle = this.add.sprite(600, 100, 'cirlce');


    // let matterLeaf = this.matter.add.gameObject(new Leaf(200, 200));
    // let sceneLeaf = this.addToScene(new Leaf(300, 200));

    this.add
    .rectangle(25, 12.5, 50, 25, 0x0000ff)
    .setName("blue1")
    .setInteractive();

    this.add
    .rectangle(650, 200, 50, 25, 0x0000ff)
    .setName("blue2")
    .setInteractive();

    this.add
    .rectangle(700, 200, 50, 25, 0xff0000)
    .setName("red1")
    .setInteractive();

    this.add
    .rectangle(750, 200, 50, 25, 0x1bf913)
    .setName("green1")
    .setInteractive();

    this.add
    .rectangle(800, 200, 50, 25, 0x0000ff)
    .setName("blue3")
    .setInteractive();

    this.add
    .rectangle(850, 200, 50, 25, 0xff0000)
    .setName("red2")
    .setInteractive();

    this.add
    .rectangle(900, 200, 50, 25, 0x1bf913)
    .setName("green2")
    .setInteractive();

    drawBoundaries(this);

    // this.scene.pause();

  },

  update: function (time) {
    this.platform.update();
    this.ball.update();
  },
});

function drawBoundaries(scene) {
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

  // Bottom sidebar boundary (from play area width → game width, at bottom)
  scene.matter.add.rectangle(
    (PLAY_AREA_WIDTH + GAME_WIDTH) / 2,
    GAME_HEIGHT - borderWidth / 2,
    GAME_WIDTH - PLAY_AREA_WIDTH,
    borderWidth,
    options
  );

  // Separator boundary (vertical line between play area and sidebar)
  scene.matter.add.rectangle(
    PLAY_AREA_WIDTH,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    options
  );

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

  // bottom sidebar
  g.moveTo(PLAY_AREA_WIDTH, GAME_HEIGHT - borderWidth / 2);
  g.lineTo(GAME_WIDTH, GAME_HEIGHT - borderWidth / 2);

  // separator
  g.moveTo(PLAY_AREA_WIDTH, 0);
  g.lineTo(PLAY_AREA_WIDTH, GAME_HEIGHT);

  g.strokePath();
  g.setScrollFactor(0);
}