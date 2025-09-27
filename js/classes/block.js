class Block extends Entity {
  constructor(x, y) {
    super(x, y);
    this.health = 3;
    this.score = 100;
    this.breakable = true;
    this.dieing = false;
    scene.blocks.add(this);
  }

  die() {
    if (this.dieing) {return}
    this.dieing = true; 
    stats.score += this.score;
    this.sprite.setSensor(true); 
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
        if (scene.gamePlay) {    
          if (Random.oneIn(10)) {
            switch (Random.die()) {
              case 1:
                new PowerUp(this.x, this.y, 0) // Multiball
                break;
              case 2:
                new PowerUp(this.x, this.y, 1) // fire
                break;
              case 4:
                if (Random.oneIn(10)) {
                  new PowerUp(this.x, this.y, 3) // portal
                }
                break;
              case 5:
                new PowerUp(this.x, this.y, 4) // gun
                break;
              case 6:
                if (Random.oneIn(10)) {
                  new PowerUp(this.x, this.y, 5) // free life
                }
                break;
              case 3:
                new PowerUp(this.x, this.y, 2) // paddle
                break;
            }
          }
        }
      }
    });
  }

  hit() {
    this.health -= 1;
    if (this.health <= 0) {
      this.die();
    }

    // TODO: Randomize spawning power ups
  }
}