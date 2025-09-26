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
    this.load.image('laser', 'images/laser.png');
    this.load.image('life', 'images/life.png');
    this.load.image('border', 'images/border.png');
    this.load.image('titleFrame', 'images/titleFrame.png');
    this.load.image('gameFrame', 'images/gameFrame.png');
    this.load.spritesheet('blocks', 'images/blocks.png', { frameWidth: 53, frameHeight: 30 });
    this.load.spritesheet("mute", "images/mute.png", { frameWidth: 32, frameHeight: 32 });
    this.load.json('titleJson', 'js/data/title.json');

    this.load.audio("click", "audio/click.mp3");
    this.load.audio("bounce1", "audio/bounce_1.mp3");
    this.load.audio("bounce2", "audio/bounce_2.mp3");
    this.load.audio("bounce3", "audio/bounce_3.mp3");
    this.load.audio("brickMetal", "audio/brick_metal.mp3");
    this.load.audio("brickMeteor", "audio/brick_meteor.mp3");
    this.load.audio("brickNormal", "audio/brick_normal.mp3");
    this.load.audio("levelClear", "audio/level_clear.mp3");
    this.load.audio("music", "audio/music.mp3");
    this.load.audio("puFire", "audio/pu_fire.mp3");
    this.load.audio("puLaser", "audio/pu_laser.mp3");
    this.load.audio("puPaddle", "audio/pu_paddle.mp3");
    this.load.audio("puPortal", "audio/pu_portal.mp3");
  },

  

  create: function () {
    scene = this;
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'titleFrame');
    jsonData = this.cache.json.get('titleJson');

    this.sounds = [];
    this.sound.pauseOnBlur = false;
    this.sounds["click"] = this.sound.add("click");              // ADDED
    this.sounds["bounce1"] = this.sound.add("bounce1");          // ADDED         
    this.sounds["bounce2"] = this.sound.add("bounce2");          // ADDED
    this.sounds["bounce3"] = this.sound.add("bounce3");          // ADDED
    this.sounds["brickMetal"] = this.sound.add("brickMetal");    // ADDED
    this.sounds["brickMeteor"] = this.sound.add("brickMeteor");  // ADDED
    this.sounds["brickNormal"] = this.sound.add("brickNormal");  // ADDED
    this.sounds["levelClear"] = this.sound.add("levelClear");    // ADDED
    this.sounds["puFire"] = this.sound.add("puFire");
    this.sounds["puLaser"] = this.sound.add("puLaser");
    this.sounds["puPaddle"] = this.sound.add("puPaddle");
    this.sounds["puPortal"] = this.sound.add("puPortal");
    if (!music) {
      music = this.sound.add("music", { loop: true });
    }
    if (!music.isPlaying) {
      music.play();
    }

    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();

    generateLevel(jsonData, true);

    this.ball = new Ball(GAME_WIDTH / 2, (GAME_HEIGHT - 20) - 15);
    this.paddle = new Paddle(GAME_WIDTH / 2, GAME_HEIGHT - 20, this.ball);
    drawBoundaries(true);
    this.ui = new Title();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject) {return}
          blockBody.gameObject.hit();
        }

        if (labels.includes('paddle') && labels.includes('ball')) {
          scene.sounds["bounce" + Phaser.Math.Between(1, 3)].play();
        }
      });
    });

    if (this.submitScore) {
      this.ui.buildHighScores(this.submitScore);
    }
  },  

  update: function (time) {
    this.paddle.update();
    this.ball.update();
  },
});
