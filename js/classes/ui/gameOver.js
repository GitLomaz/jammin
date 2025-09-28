class GameOver extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, 0, 0);

    // add border image
    const border = scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'border');
    this.add(border);

    let texts = [];

    this.title = scene.add.text(GAME_WIDTH / 2, 200, 'GAME OVER', {
      fontFamily: 'font1',
      fontSize: '42px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.title);
    texts.push(this.title);

    this.totalScore = scene.add.text(GAME_WIDTH / 2, 260, 'Total Score: ' + stats.score, {
      fontFamily: 'font1',
      fontSize: '32px'
    }).setOrigin(0.5).setAlpha(0);
    this.add(this.totalScore);
    texts.push(this.totalScore);
    
    this.input = new TextInput(GAME_WIDTH / 2, 400);
    this.add(this.input);
    texts.push(this.input);
    this.input.setAlpha(0);

    this.submitScore = scene.add.text(GAME_WIDTH / 2 - 200, 500, "Submit Score", {
      fontFamily: 'font1',
      fontSize: '42px'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.submitScore.setColor('#167d52');
      })
      .on('pointerout', () => {
        this.submitScore.setColor('#dfedef');
      })
      .on('pointerdown', () => {
        playerName = this.input.textValue || this.input.placeholder;
        scene.scene.stop(scene.scene.key);
        const data = btoa(
          '{ "game": "arkanoid", "name": "' + this.input.getValue() + '", "score": ' + stats.score + "}"
        );
        scene.scene.start('titleScene', { submitScore: data });
      })
      .setAlpha(0);
    this.add(this.submitScore);
    texts.push(this.submitScore);

    this.playAgain = scene.add.text(GAME_WIDTH / 2 + 200, 500, "Play Again", {
      fontFamily: 'font1',
      fontSize: '42px'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.playAgain.setColor('#167d52');
      })
      .on('pointerout', () => {
        this.playAgain.setColor('#dfedef');
      })
      .on('pointerdown', () => {
        resetStats();
        scene.sounds["click"].play();
        scene.scene.stop(scene.scene.key);
        scene.scene.start('selectScene');
      })
      .setAlpha(0);
    this.add(this.playAgain);
    texts.push(this.playAgain);

    texts.forEach((text, i) => {
      scene.time.delayedCall(i * 500, () => {
        scene.tweens.add({
          targets: text,
          alpha: { from: 0, to: 1 },
          duration: 400
        });
      });
    });
    scene.add.existing(this);
  }
}