class Paddle extends Entity {
  constructor(x, y, demoMode = false) {
    super(x, y);

    this.PADDLE_MARGIN = 30; // Minimum distance from edges
    this.leftSprite = scene.add.image(-50, -20, "paddleLeft");
    this.leftSprite.setScale(1, 0.4);
    this.add(this.leftSprite);

    this.middleSprite = scene.add.image(0, -20, "paddleMiddle");
    this.middleSprite.setScale(1, 0.4);
    this.add(this.middleSprite);

    this.rightSprite = scene.add.image(50, -20, "paddleRight");
    this.rightSprite.setScale(1, 0.4);
    this.add(this.rightSprite);

    this.mouseControl = true;
    this.mode = 0;
    this.armed = true;
    this.width = 150;
    this.height = 50;
    this.demoMode = demoMode;

    this.hasBall = !demoMode;
    if (!demoMode) {
      this.spawnBall();
    }

    this.body = scene.matter.add.rectangle(x, y + 20, this.width, 40, {
      restitution: 0,
      friction: 0,
      isStatic: true
    });
    this.body.label = "paddle";
    this.currentScale = 1;

    scene.matter.add.gameObject(this, this.body);
    scene.add.existing(this);

    const MAX_SPEED = 12;

    if (!demoMode) {
      // Keyboard setup
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

      this.controlMode = "mouse";

      // Switch to mouse control
      scene.input.on("pointermove", () => {
        this.controlMode = "mouse";
      });

      // Switch to keyboard control
      scene.input.keyboard.on("keydown", (event) => {
        if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(event.code)) {
          this.controlMode = "keyboard";
        }
        if (event.code === "KeyW" || event.code === "ArrowUp") {
          this.action();
        }
      });

      scene.events.on("update", () => {
        if (!this?.body?.position) return;

        const halfWidth = this.width / 2;
        let currentX = this.body.position.x;
        let moveX = 0;

        if (this.controlMode === "mouse") {
          const pointer = scene.input.activePointer;
          let targetX = Phaser.Math.Clamp(
            pointer.x,
            halfWidth + (scene.portals.getChildren().length === 0 ? this.PADDLE_MARGIN : 0),
            GAME_WIDTH - halfWidth - (scene.portals.getChildren().length === 0 ? this.PADDLE_MARGIN : 0)
          );
          let dx = targetX - currentX;
          moveX = Math.min(Math.abs(dx), MAX_SPEED) * Math.sign(dx);
        } else if (this.controlMode === "keyboard") {
          if (this.cursors.left.isDown || this.keyA.isDown) moveX = -MAX_SPEED;
          else if (this.cursors.right.isDown || this.keyD.isDown) moveX = MAX_SPEED;
        }

        if (moveX !== 0) {
          scene.matter.body.setPosition(this.body, {
            x: Phaser.Math.Clamp(
              currentX + moveX,
              halfWidth + (scene.portals.getChildren().length === 0 ? this.PADDLE_MARGIN : 0),
              GAME_WIDTH - halfWidth - (scene.portals.getChildren().length === 0 ? this.PADDLE_MARGIN : 0)
            ),
            y: y + 20
          });
          this.setPosition(this.body.position.x, this.body.position.y);
        }

        this.checkPortals();
      });

      scene.input.on("pointerdown", this.action.bind(this));
    }
  }

  checkPortals() {
    if (scene.portals.getChildren().length === 0) return;

    if (stats.currentLevel[0] === 13) {
      if (this.body.bounds.min.x < this.PADDLE_MARGIN || this.body.bounds.max.x > GAME_WIDTH - this.PADDLE_MARGIN) {
        stats.currentLevel = [1,1]
        scene.scene.restart();
      } 
    } else if (stats.currentLevel[0] < 7) {
      if (this.body.bounds.min.x < this.PADDLE_MARGIN) {
        stats.currentLevel[0]++;
        scene.scene.restart();
      } else if (this.body.bounds.max.x > GAME_WIDTH - this.PADDLE_MARGIN) {
        stats.currentLevel[0]++;
        stats.currentLevel[1]++;
        scene.scene.restart();
      } 
    } else {
      if (this.body.bounds.min.x < this.PADDLE_MARGIN) {
        if (![[7,1],[8,1],[9,1],[10,1],[11,1],[12,1]].some(arr => arr[0] === stats.currentLevel[0] && arr[1] === stats.currentLevel[1])) {
          stats.currentLevel[0]++;
          stats.currentLevel[1]--;
          scene.scene.restart();
        }
      } else if (this.body.bounds.max.x > GAME_WIDTH - this.PADDLE_MARGIN) {
        if (![[7,7],[8,6],[9,5],[10,4],[11,3],[12,2]].some(arr => arr[0] === stats.currentLevel[0] && arr[1] === stats.currentLevel[1])) {
          stats.currentLevel[0]++;
          scene.scene.restart();
        }
      } 
    }

  }

  update() {
    if (this.demoMode) {
      const leftBound = this.width / 2 + this.PADDLE_MARGIN;
      const rightBound = GAME_WIDTH - this.width / 2 - this.PADDLE_MARGIN;
      let targetX = this.demoMode.sprite.x;
      if (targetX < leftBound) targetX = leftBound;
      if (targetX > rightBound) targetX = rightBound;
      this.setPosition(targetX, this.body.position.y);
    }
  }

  spawnBall() {
    this.hasBall = true;
    this.fakeBall = scene.add.image(0, -40, "ball");
    this.add(this.fakeBall);
  }

  action() {
    if (this.hasBall) {
      this.hasBall = false;
      this.fakeBall.destroy();
      new Ball(this.body.position.x, this.body.position.y - 20);
    }

    if (this.mode === 2 && this.armed) {
      this.armed = false;
      new PaddleLaser(this.x - 40, this.y - 50);
      new PaddleLaser(this.x + 40, this.y - 50);
      scene.time.delayedCall(150, () => {
        this.armed = true;
      });
    }
  }

  setMode(mode = 0) {
    this.mode = mode;

    if (mode === 0) {
      this.PADDLE_MARGIN = 30;
      this.leftSprite.x = -50;
      this.leftSprite.y = -20;
      this.rightSprite.x = 50;
      this.rightSprite.y = -20;
      this.leftSprite.setTexture("paddleLeft");
      this.rightSprite.setTexture("paddleRight");
      this.middleSprite.setScale(1, 0.4);

      let factor = 1 / this.currentScale;
      scene.matter.body.scale(this.body, factor, 1);
      this.currentScale = 1;
    } else if (mode === 1) {
      this.PADDLE_MARGIN = 80;
      this.leftSprite.x = -100;
      this.leftSprite.y = -20;
      this.rightSprite.x = 100;
      this.rightSprite.y = -20;
      this.leftSprite.setTexture("paddleLeft");
      this.rightSprite.setTexture("paddleRight");
      this.middleSprite.setScale(3, 0.4);

      let factor = 1.6 / this.currentScale;
      scene.matter.body.scale(this.body, factor, 1);
      this.currentScale = 1.6;
    } else if (mode === 2) {
      this.PADDLE_MARGIN = 30;
      this.leftSprite.x = -50;
      this.leftSprite.y = -25;
      this.rightSprite.x = 50;
      this.rightSprite.y = -25;
      this.leftSprite.setTexture("paddleLeftLaser");
      this.rightSprite.setTexture("paddleRightLaser");
      this.middleSprite.setScale(1, 0.4);

      let factor = 1 / this.currentScale;
      scene.matter.body.scale(this.body, factor, 1);
      this.currentScale = 1;
    }
  }
}