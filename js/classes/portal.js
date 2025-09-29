class Portal extends Phaser.GameObjects.Image {
  constructor(x, y, left = true) {
    super(scene, x, y, left ? 'portalLeft' : 'portalRight');
    scene.portals.add(this);
    scene.add.existing(this);
  }
}