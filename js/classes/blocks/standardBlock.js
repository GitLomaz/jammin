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

  die() {
    stats.score += this.score;
    scene.sounds["brickNormal"].play();
    this.sprite.setSensor(true);  
    this.dieing = true; 
    if (scene.ui?.updateScore) {
      scene.ui.updateScore(stats.score);
    }

    if (scene.gamePlay) {    
      if (Random.oneIn(20)) {
        new PowerUp(this.x, this.y, 0) // Multiball
      } else if (Random.oneIn(20)) {
        new PowerUp(this.x, this.y, 1) // fire
      } else if (Random.oneIn(20)) {
        new PowerUp(this.x, this.y, 1) // paddle
      } else if (Random.oneIn(100)) {
        new PowerUp(this.x, this.y, 1) // portal
      } else if (Random.oneIn(40)) {
        new PowerUp(this.x, this.y, 1) // gun
      }
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

  hit() {
    this.die();
  }
}