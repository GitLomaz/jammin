class ProgressBar extends Entity {
  constructor(x, y, width = 250, height = 20, progress = 20) {
    super(x, y);

    this.maxWidth = width;
    this.maxHeight = height;

    // Background (red)
    this.bg = scene.add.rectangle(0, 0, this.maxWidth, this.maxHeight, 0xd75219);
    this.bg.setOrigin(0, 0.5);
    this.add(this.bg);

    // Foreground (green, starts at 0%)
    this.fg = scene.add.rectangle(0, 0, 0, this.maxHeight, 0xacff3d);
    this.fg.setOrigin(0, 0.5);
    this.add(this.fg);

    // Text (percentage)
    this.text = scene.add.text(this.maxWidth / 2, 0, "0%", {
      fontFamily: "font1",
      fontSize: "24px",
      color: "#ffffff"
    });
    this.text.setOrigin(0.5, 0.5);
    this.add(this.text);

    // Add to scene
    scene.add.existing(this);
    this.setPercent(progress)
  }

  setPercent(percent) {
    // Clamp between 0 and 100
    percent = Phaser.Math.Clamp(percent, 0, 100);

    // Update width of the green bar
    const newWidth = (percent / 100) * this.maxWidth;
    this.fg.width = newWidth;

    // Update text
    this.text.setText(percent + "%");
  }
}