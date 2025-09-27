class Laser extends Entity {
  constructor(x, y, direction = "up", paddleLaser = false) {
    super(x, y);

    scene.sounds["puLaser"].play();
    this.speed = 10;
    this.direction = direction;
    this.destroyed = false;
    scene.lasers.add(this);

    this.sprite = scene.matter.add.image(x, y, "laser", null, {
      isSensor: true,
      label: "laser",
    });
    this.sprite.body.gameObject = this;
    switch (this.direction) {
      case "up":
        this.sprite.angle = 0;
        break;
      case "down":
        this.sprite.angle = 180;
        break;
      case "left":
        this.sprite.angle = -90;
        break;
      case "right":
        this.sprite.angle = 90;
        break;
    }
  }

  update() {
    if (!this.sprite || this.destroyed) return;
    switch (this.direction) {
      case "up":
        this.sprite.y -= this.speed;
        break;
      case "down":
        this.sprite.y += this.speed;
        break;
      case "left":
        this.sprite.x -= this.speed;
        break;
      case "right":
        this.sprite.x += this.speed;
        break;
    }

    if (
      this.sprite.y < 0 ||
      this.sprite.y > GAME_HEIGHT ||
      this.sprite.x < 0 ||
      this.sprite.x > GAME_WIDTH
    ) {
      this.die();
    }
  }

  die() {
    if (this.sprite) {
      scene.matter.world.remove(this.sprite.body); // remove physics body
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}