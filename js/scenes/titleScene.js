let titleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  init(data) {
    if (data.submitScore) {
      this.submitScore = data.submitScore
    }
  },

  preload: function () {
    this.load.image('ball', 'images/hotBall.png');
    this.load.image('leaf1', 'images/leaf1.png');
    this.load.image('leaf2', 'images/leaf2.png');
    this.load.image('leaf3', 'images/leaf3.png');
    this.load.image('paddleLeft', 'images/paddleLeft.png');
    this.load.image('paddleMiddle', 'images/paddleMiddle.png');
    this.load.image('paddleRight', 'images/paddleRight.png');
    this.load.image('iron', 'images/iron.png');
    this.load.image('ironLeft', 'images/ironLeft.png');
    this.load.image('ironRight', 'images/ironRight.png');
    this.load.image('portal', 'images/portal.png');
    this.load.image('bg', 'images/bg.png');
    this.load.image('life', 'images/life.png');
    this.load.image('titleFrame', 'images/titleFrame.png');
    this.load.image('gameFrame', 'images/gameFrame.png');
    this.load.spritesheet('blocks', 'images/blocks.png', { frameWidth: 53, frameHeight: 30 });
    this.load.json('titleJson', 'js/data/title.json');
  },

  create: function () {
    scene = this;
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'titleFrame');
    this.ui = new Title();
    jsonData = this.cache.json.get('titleJson');

    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();

    generateLevel(jsonData, true);

    this.ball = new Ball(GAME_WIDTH / 2, (GAME_HEIGHT - 20) - 15);
    this.paddle = new Paddle(GAME_WIDTH / 2, GAME_HEIGHT - 20, this.ball);
    drawBoundaries(true);

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject) {return}
          blockBody.gameObject.hit();
        }
      });
    });
  },  

  update: function (time) {
    this.paddle.update();
    this.ball.update();
  },
});
