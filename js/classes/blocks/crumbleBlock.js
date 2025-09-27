class CrumbleBlock extends Block {
  constructor(x, y, frame = 2) {
    super(x, y);

    this.health = frame + 2;
    this.score = 150;

    this.sprite = scene.matter.add.sprite(x, y, 'blocks', 5 - frame, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  hit() {
    scene.sounds["brickMeteor"].play();
    this.health -= 1;
    if (this.health <= 0) {
      this.die();
    } else {
      this.sprite.setFrame(7 - this.health);
    }
  }
}