class PaddleBar extends Entity {
  constructor(extend = true) {
    super(510, 44);
    this.maxWidth = 250;
    this.maxHeight = 6;

    this.rect = scene.add.rectangle(0, 0, this.maxWidth, this.maxHeight, extend ? 0x65808c : 0x0dc6ff);
    this.add(this.rect);
    this.rect.setOrigin(1, 0.5);

    scene.tweens.add({
      targets: this.rect,
      scaleX: 0,
      duration: extend ? 60000 : 15000,
      onComplete: () => {
        this.complete()
      }
    });
    scene.add.existing(this)
  }

  complete() {
    scene.paddle.setMode()
    this.destroy()
  }
}