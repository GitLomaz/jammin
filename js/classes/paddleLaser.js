class PaddleLaser extends Entity {
  constructor(x, y) {
    super(x, y);

    scene.sounds["puLaser"].play();
    this.speed = 10;
    this.destroyed = false;
    scene.lasers.add(this);

    this.sprite = scene.matter.add.image(x, y, "laser", null, {
      isSensor: true,
      label: "paddleLaser",
    });
    this.sprite.body.gameObject = this;
    this.sprite.setScale(.5)
  }

  update() {
    if (!this.sprite || this.destroyed) return;
    this.sprite.y -= this.speed;

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
    if (this.dieing) {return}
    this.dieing = true; 
    this.sprite.setSensor(true); 
    if (this.sprite) {
      scene.matter.world.remove(this.sprite.body);
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}