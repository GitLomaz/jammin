class PowerUp extends Entity {
  constructor(x, y, type = 0) {
    super(x, y);
    this.type = type;
    // Types:
    // 0: multiball 
    // 1: fire
    // 2: paddle
    // 3: portal
    // 4: gun

    this.sprite = scene.matter.add.image(0, 0, "pu_" + type, null, {
      label: "powerup",
      isStatic: false,
      isSensor: true
    });
    this.sprite.setIgnoreGravity(true);
    this.sprite.setFrictionAir(0);
    this.sprite.setVelocity(0, 3);

    this.add(this.sprite);
    scene.powerUps.add(this);
    scene.add.existing(this);
  }

  update() {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), scene.paddle.leftSprite.getBounds()) ||
      Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), scene.paddle.middleSprite.getBounds()) ||
      Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), scene.paddle.rightSprite.getBounds())
    ) {
      this.collect();
      return;
    }

    if (this.sprite.y > GAME_HEIGHT + 50) {
    this.die()
    }
  }

  collect() {
    
    const balls = scene.balls.children
    switch (this.type) {
      case 0:
        balls.each(ball => {
          ball.split()
        });
        break;
      case 1:
        balls.each(ball => {
          // ball.split()
        });
        break;
      case 2:
          // paddle
        break;
      case 3:
        generatePortals()
        break;
      case 4:
        // gun
        break;
    
      default:
        break;
    }
    this.die()
  }

  die() {
    this.sprite.destroy();
    scene.powerUps.remove(this);
  }
}