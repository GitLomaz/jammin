class Block extends Entity {
  constructor(x, y) {
    super(x, y);
    this.health = 3;
    this.score = 100;
    this.breakable = true;
    scene.blocks.add(this);
  }

  die() {
    // score increase
  }

  hit() {
    this.health -= 1;
    if (this.health <= 0) {
      this.die();
    }

    // TODO: Randomize spawning power ups
  }
}