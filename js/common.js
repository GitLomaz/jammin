function drawBoundaries(title = false) {
  const borderWidth = 30;

  // === Matter walls ===
  const options = { isStatic: true, isSensor: false, restitution: 1, friction: 0, frictionStatic: 0, frictionAir: 0 };

  // Top boundary
  scene.matter.add.rectangle(
    GAME_WIDTH / 2,
    borderWidth / 2 + (title ? 0 : 60),
    GAME_WIDTH,
    borderWidth,
    { ...options, label: 'top_wall' }
  );

  // Left boundary
  scene.matter.add.rectangle(
    borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    { ...options, label: 'left_wall' }
  );

  // Right boundary
  scene.matter.add.rectangle(
    GAME_WIDTH - borderWidth / 2,
    GAME_HEIGHT / 2,
    borderWidth,
    GAME_HEIGHT,
    { ...options, label: 'right_wall' }
  );
}

function resetStats() {
  stats.lives = 3;
  stats.score = 0;
  stats.currentLevel = [1, 1];
}

function generateLevel(jsonData, title = false) {
  jsonData = JSON.parse(JSON.stringify(jsonData));
  // MAP SIZE OPTIONS: 
  // X = 20 or 23 (spacing or no spacing in tiles)
  // Y = 12 or up to 17 (spacing on 12, none on others)
  for (let i = 0; i < jsonData.height; i++) {
    for (let j = 0; j < jsonData.width; j++) {
      const xSpacing = jsonData.width === 20? 60 : 53;
      const ySpacing = jsonData.height === 12? 40 : 30;
      const xMargin = jsonData.width === 20? 69 : 56;
      const yMargin = title ? 60 : 130;
      let block = jsonData.layers[0].data.shift();
      switch (block) {
        case 0:
          continue;
        case 1:
        case 2:
        case 3:
        case 4:
        case 9:
        case 10:
        case 11:
          new StandardBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 1);
          break;
        case 5:
        case 6:
        case 7:
          new CrumbleBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, block - 4);
          break;
        case 8:
          new IronBlock(xMargin + j * xSpacing, yMargin + i * ySpacing);
          break;
        case 12:
          new BombBlock(xMargin + j * xSpacing, yMargin + i * ySpacing);
          break;
        case 13:
          new LaserBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, true);
          break;
        case 14:
          new LaserBlock(xMargin + j * xSpacing, yMargin + i * ySpacing, false);
          break;
      }
    }
  }
}