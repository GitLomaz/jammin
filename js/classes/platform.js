class Platform {
  constructor(scene, x, y, texture) {

    // Create a graphics object
    const graphics = scene.add.graphics();
    
    // Draw a rectangle
    graphics.fillStyle(0xffffff); // Green color
    graphics.fillRect(0, 0, 60, 20); // x, y, width, height
    
    // Optional: Add border
    graphics.lineStyle(2, 0x00ff00); // red? border
    graphics.strokeRect(0, 0, 60, 20);
    
    // Generate texture from graphics
    graphics.generateTexture('playerRect', 64, 64);
    
    // Clean up the graphics object
    graphics.destroy();

    // super(x, y);

    this.scene = scene;
    this.platformSprite = scene.add.sprite(x, y, 'playerRect');
    this.platformSprite.setScale(1);


    const initialWidth = 100;

    this.sprite = scene.matter.add.image(x, y, 'platform');
    this.sprite.setDisplaySize(this.radius * 2, this.radius * 2);

    // Physics properties
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setFrictionAir(0);

    // Initial 

    // Speed-up on collision
    this.sprite.setOnCollide(() => {
      
    });


  }

  update() {
    this.scene.input.on('pointermove', (pointer) => {
        this.platformSprite.x = pointer.x;
        // Don't change this.player.y
    });


    // Player update logic
    // const cursors = this.scene.input.keyboard.createCursorKeys();
    
    // if (cursors.left.isDown) {
    //     this.sprite.x -= this.speed * this.scene.game.loop.delta / 1000;
    // }
    // if (cursors.right.isDown) {
    //     this.sprite.x += this.speed * this.scene.game.loop.delta / 1000;
    // }
  }

  destroy() {
      this.sprite.destroy();
  }


}