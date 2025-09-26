class Game extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, 0, 0);

    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, 70, 0x000000);
    bg.setOrigin(0, 0);
    this.add(bg);

    this.scoreText = scene.add.text(40, 32, `SCORE: ${stats.score}`, {
      fontFamily: 'font1',
      fontSize: '22px',
    });
    this.scoreText.setOrigin(0, 0);
    this.add(this.scoreText);

    this.levelText = scene.add.text(GAME_WIDTH / 2, 32, `LEVEL ${stats.currentLevel[0]}-${stats.currentLevel[1]}`, {
      fontFamily: 'font1',
      fontSize: '22px',
    });
    this.levelText.setOrigin(0.5, 0);
    this.add(this.levelText);


    //add a life sprite for each life
    this.livesGroup = scene.add.group();
    for (let i = 0; i < stats.lives; i++) {
      const life = scene.add.image(GAME_WIDTH - 60 - i * 50, 45, 'life');
      life.setScale(.3, .2);
      this.livesGroup.add(life);
      this.add(life);
    }

    scene.add.existing(this);
  }

  updateScore(newScore) {
    stats.score = newScore;
    this.scoreText.setText(`SCORE: ${stats.score}`);
  }

  updateLives(newLives) {
    stats.lives = newLives;
    this.livesGroup.clear(true, true);
    for (let i = 0; i < stats.lives; i++) {
      const life = scene.add.image(GAME_WIDTH - 60 - i * 50, 45, 'life');
      life.setScale(.3, .2);
      this.livesGroup.add(life);
      this.add(life);
    }
  }
}