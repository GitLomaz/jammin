class Paddle extends Entity {
  constructor(x, y, demoMode = false) {
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
    this.demoMode = demoMode;

    this.balls = [];

    this.body = scene.matter.add.rectangle(x, y + 20, this.width, this.height, {
      // chamfer: { radius: 30 },
      restitution: 0,
      friction: 0,
      isStatic: true
    });

    scene.matter.add.gameObject(this, this.body);
    scene.add.existing(this);

    const MAX_SPEED = 15;

    if (!demoMode) {
      scene.events.on('update', () => {
        const pointer = scene.input.activePointer;
        const halfWidth = this.width / 2;
        let targetX = Phaser.Math.Clamp(pointer.x, halfWidth, GAME_WIDTH - halfWidth);
        let currentX = this.body.position.x;
        let dx = targetX - currentX;
        let moveX = Math.min(Math.abs(dx), MAX_SPEED) * Math.sign(dx);
        scene.matter.body.setPosition(this.body, { x: currentX + moveX, y: y + 20 });
        this.setPosition(this.body.position.x, this.body.position.y);
        this.checkPortals();
      });
    }

  }

  checkPortals() {
    if (scene.portals.getChildren().length === 0) {return}
    if (this.body.bounds.min.x < 30) {
      currentLevel[0]++;
      scene.scene.restart();
    } else if (this.body.bounds.max.x > GAME_WIDTH - 30) {
      currentLevel[0]++;
      currentLevel[1]++;
      scene.scene.restart();
    }
  }

  update() {
    // this.setPosition(this.body, this.body.position.y);
    if (this.demoMode) {
      this.setPosition(this.demoMode.sprite.x, this.body.position.y);
    }
  }
}