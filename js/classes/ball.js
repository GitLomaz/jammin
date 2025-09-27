class Ball extends Entity {
  constructor(x, y) {
    super(x, y);

    this.radius = 10;
    this.speed = 6; // fixed speed

    this.sprite = scene.matter.add.image(x, y, 'ball');
    this.sprite.setDisplaySize(this.radius * 2, this.radius * 2);
    this.sprite.setCircle(this.radius);
    this.sprite.body.label = "ball";

    this.sprite.body.fire = true

    // physics settings
    this.sprite.setBounce(1);           // full energy on bounce
    this.sprite.setFriction(0, 0, 0);   // no surface friction
    this.sprite.setFrictionAir(0);      // no air drag
    this.sprite.setIgnoreGravity(true); // just in case

    // give initial push
    this.setVelocity(Phaser.Math.Between(-this.speed, this.speed), -this.speed);
    scene.balls.add(this);
  }

  setVelocity(vx, vy) {
    this.sprite.setVelocity(vx, vy);
  }

  update() {
    const body = this.sprite.body;
    if (!body) return;

    this.sprite.rotation = 0;

    let vx = body.velocity.x;
    let vy = body.velocity.y;
    let currentSpeed = Math.sqrt(vx * vx + vy * vy);

    if (currentSpeed === 0) {
      this.setVelocity(this.speed, -this.speed);
      return;
    }

    let angle = Math.atan2(vy, vx);
    if (angle > 1.832 && angle < 1.9) {
      angle = 1.9;
    } else if (angle < -1.832 && angle > -1.9) {
      angle = -1.9;
    } else if (angle > -0 && angle < 0.314) {
      angle = 0.314;
    } else if (angle < -0.314 && angle > 0) {
      angle = -0.314;
    }

    vx = Math.cos(angle) * this.speed;
    vy = Math.sin(angle) * this.speed;
    this.setVelocity(vx, vy);

    if (this.sprite.y > GAME_HEIGHT + 50) {
      this.sprite.destroy();
      scene.balls.remove(this);
      if (scene.balls.getChildren().length === 0) {
        stats.lives--;
        scene.ui.updateLives(stats.lives);
        if (stats.lives > 0) {
          scene.paddle.spawnBall();
        } else {
          new GameOver();
        }
      }
    }
  }
  
  split() {
    if (scene.balls.getChildren().length > 50) {return}
    const ball2 = new Ball(this.sprite.x, this.sprite.y);
    ball2.setVelocity(-this.sprite.body.velocity.x, this.sprite.body.velocity.y);
    const ball3 = new Ball(this.sprite.x, this.sprite.y);
    ball3.setVelocity(this.sprite.body.velocity.x, -this.sprite.body.velocity.y);
  }
}