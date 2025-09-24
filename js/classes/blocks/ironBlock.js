class IronBlock extends Block {
  constructor(x, y) {
    super(x, y);

    this.health = 1;
    this.score = 50;

    this.sprite = scene.matter.add.sprite(x, y, 'blocks', 7, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  hit() {}
}