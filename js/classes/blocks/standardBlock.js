class StandardBlock extends Block {
  constructor(x, y, frame = 0) {
    super(x, y);

    this.health = 1;
    this.score = 50;

    console.log(frame)

    this.sprite = scene.matter.add.sprite(x, y, 'block', frame, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  die() {
    // shrink to nothing
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 0,
      scaleY: 0,
      duration: 100,
      onComplete: () => {
        this.sprite.destroy();
        scene.blocks.remove(this);
      }
    });
  }

  hit() {
    console.log('hit?!')
    this.die();
  }
}