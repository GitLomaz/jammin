class HotBar extends Entity {
  constructor() {
    super(740, 44);
    this.maxWidth = 250;
    this.maxHeight = 6;

    this.rect = scene.add.rectangle(0, 0, this.maxWidth, this.maxHeight, 0xef591e);
    this.add(this.rect);
    this.rect.setOrigin(0, 0.5);

    this.tween = scene.tweens.add({
      targets: this.rect,
      scaleX: 0,
      duration: 15000,
      onComplete: () => {
        this.complete()
      }
    });
    scene.add.existing(this)
  }

  complete() {
    if (this.tween !== null) {
      this.tween.stop();
    }
    this.tween = null;
    scene.balls.children.each(ball => {
      ball.sprite.body.hot = false
      ball.setHot()
    });
    this.destroy()
  }
}