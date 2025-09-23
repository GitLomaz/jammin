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
      // restart if stuck
      this.setVelocity(this.speed, -this.speed);
      return;
    }

    let angle = Math.atan2(vy, vx); // radians
    let deg = Phaser.Math.RadToDeg(angle);

    // normalize manually
    deg = this.normalizeDegrees(deg);

    // clamp away from horizontal (0°, 180°) and vertical (90°, -90°)
    const minAngle = 15;
    if (Math.abs(deg % 180) < minAngle) {
      deg = minAngle * Math.sign(deg || 1);
    } else if (Math.abs((Math.abs(deg) - 90) % 180) < minAngle) {
      deg = (90 + minAngle) * Math.sign(deg || 1);
    }

    // back to radians
    angle = Phaser.Math.DegToRad(deg);

    // set velocity with fixed magnitude
    vx = Math.cos(angle) * this.speed;
    vy = Math.sin(angle) * this.speed;
    this.setVelocity(vx, vy);
  }

  normalizeDegrees(angle) {
    angle = angle % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
  }
}