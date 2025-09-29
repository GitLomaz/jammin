let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
    this.load.json('level' + JSON.stringify(stats.currentLevel), 'js/data/' +  stats.currentLevel[0] + '_' + stats.currentLevel[1] + '.json');
  },

  create: function () {
    scene = this;
    this.gamePlay = true
    jsonData = this.cache.json.get('level' + JSON.stringify(stats.currentLevel));
    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();
    this.lasers = this.add.group();
    this.powerUps = this.add.group();

    this.sounds = [];
    this.sound.pauseOnBlur = false;
    this.sounds["click"] = this.sound.add("click");
    this.sounds["bounce1"] = this.sound.add("bounce1");
    this.sounds["bounce2"] = this.sound.add("bounce2");
    this.sounds["bounce3"] = this.sound.add("bounce3");
    this.sounds["brickMetal"] = this.sound.add("brickMetal");
    this.sounds["brickMeteor"] = this.sound.add("brickMeteor");
    this.sounds["brickNormal"] = this.sound.add("brickNormal");
    this.sounds["levelClear"] = this.sound.add("levelClear");
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

    this.puHotBar = false
    this.puPaddleBar = false

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);
    console.log(this.bg)
    this.ui = new Game();
    this.bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'gameFrame');

    generateLevel(jsonData);

    this.paddle = new Paddle(GAME_WIDTH / 2, GAME_HEIGHT - 20);
    drawBoundaries();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          let ballBody = labels[0] === 'ball' ? bodyA : bodyB;     
          if (ballBody.hot) {
            pair.isActive = false
          }
          if (!blockBody || !blockBody.gameObject || blockBody.gameObject.dieing) { return }
          if (ballBody.hot) {
            blockBody.gameObject.die();
          } else {
            blockBody.gameObject.hit();
          }
        }
          
        // paddle
        if (labels.includes('paddle') && labels.includes('ball')) {
          const paddleBody = bodyA.label === 'paddle' ? bodyA : bodyB;
          const ballBody   = bodyA.label === 'ball'   ? bodyA : bodyB;
          const offset = (ballBody.position.x - paddleBody.position.x);
          const halfWidth = paddleBody.bounds.max.x - paddleBody.position.x;
          const normalized = Phaser.Math.Clamp(offset / halfWidth, -1, 1);
          const maxAngle = Phaser.Math.DegToRad(60);
          const angle = normalized * maxAngle;
          const speed = 6;
          const vx = speed * Math.sin(angle);
          const vy = -speed * Math.cos(angle);
          scene.matter.body.setVelocity(ballBody, { x: vx, y: vy });
          scene.sounds["bounce" + Phaser.Math.Between(1, 3)].play();
        }
          
        // laser
        if (labels.includes('laser') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject || blockBody.gameObject.dieing) {return}
          blockBody.gameObject.die();
        }
          
        // paddle laser
        if (labels.includes('paddleLaser') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          let laserBody = labels[0] === 'paddleLaser' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject || blockBody.gameObject.dieing) {return}
          if (!laserBody || !laserBody.gameObject || laserBody.gameObject.dieing) {return}
          blockBody.gameObject.hit();
          laserBody.gameObject.die();
        }
          
        // paddle laser
        if (labels.includes('paddleLaser') && labels.includes('wall')) {
          let laserBody = labels[0] === 'paddleLaser' ? bodyA : bodyB;     
          if (!laserBody || !laserBody.gameObject || laserBody.gameObject.dieing) {return}
          laserBody.gameObject.die();
        }
          
        // laser
        if (labels.includes('laser') && labels.includes('wall')) {
          let laserBody = labels[0] === 'laser' ? bodyA : bodyB;     
          if (!laserBody || !laserBody.gameObject || laserBody.gameObject.dieing) {return}
          laserBody.gameObject.die();
        }
      });
    });
  },  

  update: function (time) {
    this.paddle.update();
    this.lasers.children.each((laser) => laser.update());
    this.balls.children.each((ball) => ball.update());
    this.portals.children.each((portal) => portal.update());
    this.powerUps.children.each((pu) => pu.update());

    let anyBreakableLeft = false;
    this.blocks.children.each((block) => {
      if (block.breakable) {
        anyBreakableLeft = true;
      }
    });

    if (!anyBreakableLeft) {
      scene.sounds["levelClear"].play();
      generatePortals();
    }
  },
});

function generatePortals() {
  if (scene.portals.children.size === 0) {
    levelsComplete = JSON.parse(localStorage.getItem('levelsComplete')) || [];
    levelsComplete.push([stats.currentLevel[0], stats.currentLevel[1]]);
    levelsComplete = levelsComplete.filter((level, index, self) => 
      index === self.findIndex(l => l[0] === level[0] && l[1] === level[1])
    );
    localStorage.setItem('levelsComplete', JSON.stringify(levelsComplete));
    if (![[7,1],[8,1],[9,1],[10,1],[11,1],[12,1]].some(arr => arr[0] === stats.currentLevel[0] && arr[1] === stats.currentLevel[1])) {
      new Portal(15, GAME_HEIGHT - 42);
    }
    if (![[7,7],[8,6],[9,5],[10,4],[11,3],[12,2]].some(arr => arr[0] === stats.currentLevel[0] && arr[1] === stats.currentLevel[1])) {
      new Portal(GAME_WIDTH - 15, GAME_HEIGHT - 42, false);
    }
    scene.bg.setTexture('gameFramePortals')
  }
}