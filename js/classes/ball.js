class Ball extends Entity {
  constructor(x, y) {
    super(x, y);

    this.radius = 10;
    this.speed = 6; // fixed speed

    this.sprite = scene.matter.add.image(x, y, 'ball');
    this.sprite.setDisplaySize(this.radius * 2, this.radius * 2);
    this.sprite.setCircle(this.radius);
    this.sprite.body.label = "ball";

    // physics settings
    this.sprite.setBounce(1);           // full energy on bounce
    this.sprite.setFriction(0, 0, 0);   // no surface friction
    this.sprite.setFrictionAir(0);      // no air drag
    this.sprite.setIgnoreGravity(true); // just in case

    // give initial push
    this.setVelocity(Phaser.Math.Between(-this.speed, this.speed), -this.speed);
  }

  setVelocity(vx, vy) {
    this.sprite.setVelocity(vx, vy);
  }

  update() {
    const body = this.sprite.body;
    if (!body) return;
    this.sprite.rotation = 0; // prevent rotation
    let vx = body.velocity.x;
    let vy = body.velocity.y;
    let currentSpeed = Math.sqrt(vx * vx + vy * vy);

    if (currentSpeed === 0) {
      // restart if it ever gets stuck
      this.setVelocity(this.speed, -this.speed);
      return;
    }

    // avoid perfect vertical or horizontal (ball can “lock” bouncing up/down)
    if (Math.abs(vx) < 0.01) vx = 0.1 * Math.sign(vx || 1);
    if (Math.abs(vy) < 0.01) vy = 0.1 * Math.sign(vy || 1);

    // normalize back to constant speed
    const scale = this.speed / Math.sqrt(vx * vx + vy * vy);
    this.setVelocity(vx * scale, vy * scale);
  }
}