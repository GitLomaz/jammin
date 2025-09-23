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

    this.platformSprite = scene.matter.add.sprite(x, y, 'playerRect');
    this.platformSprite.body.label = "platform";

    // This prevents the platform from getting bounced when hit
    this.platformSprite.setStatic(true);
    this.platformSprite.setBounce(-1);           // full energy on bounce
    this.platformSprite.setFriction(0, 0, 0);   // no surface friction
    this.platformSprite.setFrictionAir(0);      // no air drag
    this.platformSprite.setIgnoreGravity(true); // just in case
    this.platformSprite.setVelocity(0, 0);
    this.platformSprite.x = 1280 / 2; // Start the platform x position in the middle of the screen

    // Speed-up on collision
    this.platformSprite.setOnCollide(() => {
      console.log('onCollide')
      this.platformSprite.setVelocity(0, 0);
    });


  }

  update() {
    // When the pointer moves, the platform will also move, only across the horizontal axis
    this.scene.input.on('pointermove', (pointer) => {
      this.platformSprite.setVelocity(0, 0);
      // console.log('this.platformSprite.width', this.platformSprite.width);
      // console.log('(this.platformSprite.width / 2) + 10', (this.platformSprite.width / 2) + 10)
      // console.log('pointer.x', pointer.x)
      if (pointer.x < ((this.platformSprite.width / 2) + 10)) {
        this.platformSprite.x = 40;
        return;
      }

      if (pointer.x > 1280 - ((this.platformSprite.width / 2) - 10)) {
        this.platformSprite.x = 1240;
        return;
      }
      
      this.platformSprite.x = pointer.x;
    });
  }

  destroy() {
      this.platformSprite.destroy();
  }

}