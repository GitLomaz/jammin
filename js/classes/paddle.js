class Paddle extends Entity {
  constructor(x, y) {
    super(x, y);
    this.leftSprite = scene.add.image(-50, 0, "paddleLeft");
    this.add(this.leftSprite);
    this.middleSprite = scene.add.image(0, 0, "paddleMiddle");
    this.add(this.middleSprite);
    this.rightSprite = scene.add.image(50, 0, "paddleRight");
    this.add(this.rightSprite);

    this.width = 150;
    this.height = 50;

    this.body = scene.matter.add.rectangle(x, y, this.width, this.height, {
      chamfer: { radius: 35 },
      restitution: 0,
      friction: 0,
      isStatic: true
    });

    scene.matter.add.gameObject(this, this.body);
    scene.add.existing(this);

    scene.input.on("pointermove", (pointer) => {
      const halfWidth = this.width / 2;
      let targetX = Phaser.Math.Clamp(pointer.x, halfWidth, GAME_WIDTH - halfWidth);
      scene.matter.body.setPosition(this.body, { x: targetX, y: y });
      this.setPosition(this.body.position.x, this.body.position.y);
    });
  }
}