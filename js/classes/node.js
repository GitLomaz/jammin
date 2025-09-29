class Node extends Entity {
  constructor(x, y, type = 0, location, jsonData = {}) {
    super(x, y);
    this.location = location;
    this.type = type;
    this.jsonData = jsonData;

    // Node sprite
    this.sprite = scene.add.image(0, 0, "ball").setInteractive({ useHandCursor: true });
    this.setNodeType(type);
    this.add(this.sprite);

    // Holder for spinning circle
    this.circle = null;

    // Add click handler
    this.sprite.on("pointerdown", () => {
      this.activate();
    });

    scene.add.existing(this);
  }

  setNodeType(type) {
    if (unlockAll) {
      type = 2
    }
    this.type = type
    let texture;
    if (type === 0) {
      texture = "ball";
    } else if (type === 1) {
      texture = "hotBall";
    } else if (type === 2) {
      texture = "greenBall";
    }
    this.sprite.setTexture(texture);
  }

  activate() {
    scene.sounds["click"].play();
    scene.allNodes.forEach(node => {
      if (node.circle) {
        node.circle.destroy();
      }  
    });
    scene.blocks.getChildren().forEach(brick => {
      brick.sprite.destroy()
    })

    let status = "Locked"
    if (this.type === 1) {
      status = "Unlocked";
    } else if (this.type === 2) {
      status = "Cleared";
    }

    scene.sector.setText("Sector: " + this.location.row + " - " + this.location.col)
    scene.status.setText("Status: " + status)

    scene.selectedLevel = [this.location.row, this.location.col]

    if (this.type === 0) {
      scene.questionMark.setAlpha(1)
      scene.launch.setVisible(false)
      scene.launchButton.setVisible(false)
    } else {
      scene.questionMark.setAlpha(0)
      scene.launch.setVisible(true)
      scene.launchButton.setVisible(true)
      generateLevel(this.jsonData, false, true)
    }
    const radius = this.sprite.displayWidth / 2 + 4;

    // Create dashed circle graphics
    const graphics = scene.add.graphics({
      lineStyle: { width: 2, color: 0xffffff }
    });

    const dashSize = 6;
    const gapSize = 6;
    for (let angle = 0; angle < 360; angle += dashSize + gapSize) {
      const startRad = Phaser.Math.DegToRad(angle);
      const endRad = Phaser.Math.DegToRad(angle + dashSize);
      graphics.beginPath();
      graphics.arc(0, 0, radius, startRad, endRad);
      graphics.strokePath();
    }

    // Put into container with node so it moves with it
    this.circle = scene.add.container(0, 0);
    this.circle.add(graphics);
    this.add(this.circle);

    // Spin animation
    scene.tweens.add({
      targets: this.circle,
      angle: 360,
      duration: 5000,
      repeat: -1
    });
  }
}