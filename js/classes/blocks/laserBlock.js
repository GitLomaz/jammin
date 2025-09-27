class LaserBlock extends Block {
  constructor(x, y, horizontal = true) {
    super(x, y);
    this.horizontal = horizontal;
    this.health = 1;
    this.score = 150;

    this.sprite = scene.matter.add.sprite(x, y, 'blocks', horizontal ? 12 : 13, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  die() {
    super.die()
    if (this.horizontal) {
      new Laser(this.sprite.x, this.sprite.y, "left");
      new Laser(this.sprite.x, this.sprite.y, "right");
    } else {
      new Laser(this.sprite.x, this.sprite.y, "up");
      new Laser(this.sprite.x, this.sprite.y, "down");
    }
  }

  hit() {
    this.die();
  }
}