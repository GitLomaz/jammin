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
      let vx = this.sprite.body.velocity.x;
      let vy = this.sprite.body.velocity.y;

      // Current speed (magnitude)
      let speed = Math.sqrt(vx * vx + vy * vy);

      // Increase speed by 1%
      speed *= 1.01;

      // Clamp
      const maxSpeed = 20;
      speed = Phaser.Math.Clamp(speed, 0, maxSpeed);

      // Normalize direction
      let len = Math.sqrt(vx * vx + vy * vy) || 1;
      vx = (vx / len) * speed;
      vy = (vy / len) * speed;

      this.sprite.setVelocity(vx, vy);
    });
  }
}