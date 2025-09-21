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
    
    this.matter.world.setBounds(
      0, 0, GAME_WIDTH, GAME_HEIGHT,
      128,  // thickness of the walls
      true, true, true, true // left, right, top, bottom enabled
    );

    for (let i = 0; i < 10; i++) {
      new Leaf(Random.between(100, 900), Random.between(100, 600));
      
    }

    new Ball(200, 150);

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

    // drawBoundaries(this);

    // this.scene.pause();

  },

  update: function (time) {
  },
});

function drawBoundaries(scene) {
  const borderWidth = 10;
  const borderColor = 0x717171;

  // Top boundary
  scene.topCanvasBoundary = scene.add.graphics();
  scene.topCanvasBoundary.lineStyle(borderWidth, borderColor);
  scene.topCanvasBoundary.moveTo(0, 0 + (borderWidth / 2));
  // scene.topCanvasBoundary.lineTo(PLAY_AREA_WIDTH + (borderWidth / 2), 0 + (borderWidth / 2)); // Top
  scene.topCanvasBoundary.lineTo(GAME_WIDTH + (borderWidth / 2), 0 + (borderWidth / 2)); // Top
  scene.topCanvasBoundary.strokePath(0, 0);
  scene.topCanvasBoundary.setScrollFactor(0);

  // Left boundary
  scene.leftCanvasBoundary = scene.add.graphics();
  scene.leftCanvasBoundary.lineStyle(borderWidth, borderColor);
  scene.leftCanvasBoundary.moveTo(0 + (borderWidth / 2), PLAY_AREA_HEIGHT);
  scene.leftCanvasBoundary.lineTo(0 + (borderWidth / 2), 0 + (borderWidth / 2));
  scene.leftCanvasBoundary.strokePath(0, 0);
  scene.leftCanvasBoundary.setScrollFactor(0);

  // Right boundary
  scene.rightCanvasBoundary = scene.add.graphics();
  scene.rightCanvasBoundary.lineStyle(borderWidth, borderColor);
  scene.rightCanvasBoundary.moveTo(GAME_WIDTH - (borderWidth / 2), 0 + (borderWidth / 2));
  scene.rightCanvasBoundary.lineTo(GAME_WIDTH - (borderWidth / 2), GAME_HEIGHT + (borderWidth / 2)); // Top
  scene.rightCanvasBoundary.strokePath(0, 0);
  scene.rightCanvasBoundary.setScrollFactor(0);

  // Score sidebar bottom
  scene.bottomSidebarBoundary = scene.add.graphics();
  scene.bottomSidebarBoundary.lineStyle(borderWidth, borderColor);
  scene.bottomSidebarBoundary.moveTo(PLAY_AREA_WIDTH - (borderWidth / 2), GAME_HEIGHT - (borderWidth / 2));
  scene.bottomSidebarBoundary.lineTo(GAME_WIDTH - (borderWidth / 2), GAME_HEIGHT - (borderWidth / 2)); // Top
  scene.bottomSidebarBoundary.strokePath(0, 0);
  scene.bottomSidebarBoundary.setScrollFactor(0);


  // One-fifth boundary (separator between game area and score sidebar)
  scene.separatorBoundary = scene.add.graphics();
  scene.separatorBoundary.lineStyle(borderWidth, borderColor);
  scene.separatorBoundary.moveTo(PLAY_AREA_WIDTH, 0 + (borderWidth / 2));
  scene.separatorBoundary.lineTo(PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT + (borderWidth / 2)); // Top
  scene.separatorBoundary.strokePath(0, 0);
  scene.separatorBoundary.setScrollFactor(0);
}