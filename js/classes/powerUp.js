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
    // 5: life

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
    scene.paddle.action()
    const balls = scene.balls.children
    switch (this.type) {
      case 0:
        balls.each(ball => { 
          ball.split()
        });
        break;
      case 1:
        if (scene.puHotBar) {
          scene.puHotBar.complete()
        }
        scene.puHotBar = new HotBar()
        balls.each(ball => {
          ball.sprite.body.hot = true
          ball.setHot()
        });
        break;
      case 2:
        if (scene.puPaddleBar) {
          scene.puPaddleBar.complete()
        }
        scene.puPaddleBar = new PaddleBar()
        scene.paddle.setMode(1)
        break;
      case 3:
        generatePortals()
        break;
      case 4:
        if (scene.puPaddleBar) {
          scene.puPaddleBar.complete()
        }
        scene.puPaddleBar = new PaddleBar(false)
        scene.paddle.setMode(2)
        break;
      case 5:
        stats.lives++;
        if (stats.lives > 5) {
          stats.lives = 5
        }
        scene.ui.updateLives(stats.lives);
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