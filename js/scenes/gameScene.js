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
    jsonData = this.cache.json.get('level' + JSON.stringify(stats.currentLevel));
    this.blocks = this.add.group();
    this.balls = this.add.group();
    this.portals = this.add.group();

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);
    this.ui = new Game();
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'gameFrame');

    generateLevel(jsonData);

    this.paddle = new Paddle(GAME_WIDTH / 2, GAME_HEIGHT - 20);
    drawBoundaries();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('ball') && labels.includes('block')) {
          let blockBody = labels[0] === 'block' ? bodyA : bodyB;     
          if (!blockBody || !blockBody.gameObject) {return}
          blockBody.gameObject.hit();
        }
          
        // PowerUp into Player collision
        if (labels.includes('paddle') && labels.includes('powerUp')) {
          const powerUp = labels[0] === 'powerUp' ? bodyA : bodyB;
          powerUp.gameObject.collect();
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
        }
      });
    });
  },  

  update: function (time) {
    this.paddle.update();
    this.balls.children.each((ball) => ball.update());
    this.portals.children.each((portal) => portal.update());
    let anyBreakableLeft = false;
    this.blocks.children.each((block) => {
      if (block.breakable) {
        anyBreakableLeft = true;
      }
    });

    if (!anyBreakableLeft) {
      generatePortals();
    }
  },
});

function generatePortals() {
  if (scene.portals.children.size === 0) {
    new Portal(15, GAME_HEIGHT - 42);
    new Portal(GAME_WIDTH - 15, GAME_HEIGHT - 42);
  }
}