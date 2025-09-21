class Ball extends Entity {
  constructor(x, y) {
    super(x, y);

    this.radius = 10;

    this.sprite = scene.matter.add.image(x, y, 'ball');
    this.sprite.setDisplaySize(this.radius * 2, this.radius * 2);
    this.sprite.setCircle(this.radius);

    // Physics properties
    this.sprite.setBounce(1);
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setFrictionAir(0);

    // Initial velocity
    this.sprite.setVelocity(Phaser.Math.Between(-5, 5), -5);

    // Speed-up on collision
    this.sprite.setOnCollide(() => {
      let vx = this.sprite.body.velocity.x * 1.1;
      let vy = this.sprite.body.velocity.y * 1.1;
      this.sprite.setVelocity(vx, vy);
    });
  }
}