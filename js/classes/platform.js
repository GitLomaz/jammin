class Platform {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    const initialWidth = 60;
    const height = 20;

    // Create a graphics object
    const graphics = this.scene.add.graphics();
    
    // Draw a rectangle
    graphics.fillStyle(0xffffff); // Green color
    graphics.fillRect(0, 0, initialWidth, height); // x, y, width, height
    
    // Optional: Add border
    graphics.lineStyle(2, 0x00ff00); // red? border
    graphics.strokeRect(0, 0, initialWidth, height);
    
    // Generate texture from graphics
    graphics.generateTexture('playerRect', initialWidth, height);
    
    // Clean up the graphics object
    graphics.destroy();

    this.platformSprite = this.scene.add.sprite(x, y, 'playerRect');
    this.platformSprite.setScale(1);

    this.sprite = this.scene.matter.add.image(x, y, 'platform');
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
    // When the pointer moves, the platform will also move, only across the horizontal axis
    this.scene.input.on('pointermove', (pointer) => {
        this.platformSprite.x = pointer.x;
    });
  }

  destroy() {
      this.sprite.destroy();
  }

}