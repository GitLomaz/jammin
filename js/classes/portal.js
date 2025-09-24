class Portal extends Phaser.GameObjects.TileSprite {
  constructor(x, y) {
    super(scene, x, y, 30, 85, 'portal');
    scene.portals.add(this);
    scene.add.existing(this);
  }

  update() {
    this.tilePositionY -= 1;
  }
}