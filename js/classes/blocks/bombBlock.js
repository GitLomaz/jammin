class BombBlock extends Block {
  constructor(x, y, frame = 0) {
    super(x, y);

    this.health = 1;
    this.score = 550;
    this.armed = true;

    this.sprite = scene.matter.add.sprite(x, y, 'blocks', 11, {
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

    const sourceBlock = this

    if (this.armed) {
      this.armed = false;
      const circle = scene.add.circle(
        this.sprite.body.position.x,
        this.sprite.body.position.y,
        4,            // starting radius
        0xff0000,     // color
        0.9           // alpha
      ).setBlendMode(Phaser.BlendModes.ADD);

      // Tween it to grow & fade
      scene.tweens.add({
        targets: circle,
        radius: 120,
        alpha: .5,
        duration: 300,
        ease: 'Linear',
        onUpdate: () => {
          scene.blocks.children.each(block => {
            if (block === sourceBlock || block.dieing) {
              return;
            }
            const sprite = block.sprite;
            if (!sprite?.body) return;

            const dx = sprite.body.position.x - circle.x;
            const dy = sprite.body.position.y - circle.y;
            if (dx * dx + dy * dy <= circle.radius * circle.radius) {
              console.log(block)
              block.die();
            }
          });
        },
        onComplete: () => {
          circle.destroy();
        }
      });
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
    };
    
  }

  hit() {
    this.die();
  }
}