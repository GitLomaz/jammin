class StandardBlock extends Block {
  constructor(x, y) {
    super(x, y);

    this.health = 1;
    this.score = 50;

    this.sprite = scene.matter.add.image(x, y, 'block', null, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  die() {
    this.sprite.destroy();
    this.destroy();
  }

  hit() {
    console.log('hit?!')
    this.die();
  }
}