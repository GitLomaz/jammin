class IronBlock extends Block {
  constructor(x, y) {
    super(x, y);
    this.breakable = false;
    this.sprite = scene.matter.add.sprite(x, y, 'blocks', 7, {
      isStatic: true,
      restitution: 0,
      friction: 0,
    });
    this.sprite.body.gameObject = this;
    this.sprite.body.label = "block";
    scene.add.existing(this.sprite);
  }

  die() {
    stats.score += this.score;
    this.sprite.setSensor(true);  
    this.dieing = true; 
    if (scene.ui?.updateScore) {
      scene.ui.updateScore(stats.score);
    }
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
}