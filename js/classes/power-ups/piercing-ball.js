class PiercingBall extends Ball {
  constructor(x, y, frame = 0) {
    super(x, y);

    this.sprite = scene.matter.add.image(x, y, 'piercingBall');
    this.piercing = true;
    scene.add.existing(this.sprite);
  }

  
}