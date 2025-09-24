class Paddle extends Entity {
  constructor(x, y) {
    super(x, y);
    this.leftSprite = scene.add.image(-50, -20, "paddleLeft");
    this.leftSprite.setScale(1, .4)
    this.add(this.leftSprite);
    this.middleSprite = scene.add.image(0, -20, "paddleMiddle");
    this.middleSprite.setScale(1, .4)
    this.add(this.middleSprite);
    this.rightSprite = scene.add.image(50, -20, "paddleRight");
    this.rightSprite.setScale(1, .4)
    this.add(this.rightSprite);

    this.width = 150;
    this.height = 50;

    this.body = scene.matter.add.rectangle(x, y + 20, this.width, this.height, {
      chamfer: { radius: 30 },
      restitution: 0,
      friction: 0,
      isStatic: true
    });

    scene.matter.add.gameObject(this, this.body);
    scene.add.existing(this);

    scene.input.on("pointermove", (pointer) => {
      const halfWidth = this.width / 2;
      let targetX = Phaser.Math.Clamp(pointer.x, halfWidth, GAME_WIDTH - halfWidth);
      scene.matter.body.setPosition(this.body, { x: targetX, y: y + 20 });
      this.setPosition(this.body.position.x, this.body.position.y);
    });
  }
}