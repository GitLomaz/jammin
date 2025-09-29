class StandardBlock extends Block {
  constructor(x, y, frame = 0) {
    super(x, y);

    this.health = 1;
    this.score = 50;

    this.sprite = scene.matter.add.sprite(x, y, 'blocks', frame, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  hit() {
    scene.sounds["brickNormal"].play();
    this.die();
  }
}