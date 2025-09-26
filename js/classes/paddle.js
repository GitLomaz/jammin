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

    this.hasBall = !demoMode;
    if (this.hasBall) {
      this.fakeBall = scene.add.image(0, -40, "ball");
      this.add(this.fakeBall);
    }

    this.body = scene.matter.add.rectangle(x, y + 20, this.width, this.height, {
      restitution: 0,
      friction: 0,
      isStatic: true
    });

    this.body.label = "paddle";

    scene.matter.add.gameObject(this, this.body);
    scene.add.existing(this);

    const MAX_SPEED = 15;

    if (!demoMode) {
      try {
        scene.events.on('update', () => {
          if (!this?.body?.position) {
            return;
          }
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
      } catch (error) {}
      scene.input.on('pointerdown', () => {
        if (this.hasBall) {
          this.hasBall = false;
          this.fakeBall.destroy();
          new Ball(this.body.position.x, this.body.position.y - 20);
        }
      });
    }
  }

  checkPortals() {
    if (scene.portals.getChildren().length === 0) {return}
    if (this.body.bounds.min.x < 30) {
      stats.currentLevel[0]++;
      scene.scene.restart();
    } else if (this.body.bounds.max.x > GAME_WIDTH - 30) {
      stats.currentLevel[0]++;
      stats.currentLevel[1]++;
      scene.scene.restart();
    }
  }

  update() {
    if (this.demoMode) {
      const leftBound = this.width / 2 + 30;
      const rightBound = GAME_WIDTH - this.width / 2 - 30;
      let targetX = this.demoMode.sprite.x;
      if (targetX < leftBound) targetX = leftBound;
      if (targetX > rightBound) targetX = rightBound;
      this.setPosition(targetX , this.body.position.y);
    }
  }

  spawnBall() {
    this.hasBall = true;
    if (this.hasBall) {
      this.fakeBall = scene.add.image(0, -40, "ball");
      this.add(this.fakeBall);
    }
  }
}