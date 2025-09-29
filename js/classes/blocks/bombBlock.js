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
    super.die()
    const sourceBlock = this
    if (this.armed) {
      scene.sounds["explosion"].play();
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
              block.die();
            }
          });
        },
        onComplete: () => {
          circle.destroy();
        }
      });
    };
    
  }

  hit() {
    this.die();
  }
}