class PowerUp extends Entity {
  constructor(x, y) {
    super(x, y);

    this.score = 1000;
    this.breakable = true;
    this.sprite.body.label = "powerUp";
    scene.powerups.add(this);
  }

  collect() {
    // Increase score
    // Despawn powerup
  }
}