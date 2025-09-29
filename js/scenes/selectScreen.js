let selectScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function selectScene() {
    Phaser.Scene.call(this, { key: "selectScene" });
  },

  preload: function () {

    this.nodes = [
      [1,1],
      [2,1],[2,2],
      [3,1],[3,2],[3,3],
      [4,1],[4,2],[4,3],[4,4],
      [5,1],[5,2],[5,3],[5,4],[5,5],
      [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
      [7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],
      [8,1],[8,2],[8,3],[8,4],[8,5],[8,6],
      [9,1],[9,2],[9,3],[9,4],[9,5],
      [10,1],[10,2],[10,3],[10,4],
      [11,1],[11,2],[11,3],
      [12,1],[12,2],
      [13,1]
    ]

    this.nodes.forEach(node => {
      this.load.json(
        'level' + node[0] + '_' + node[1],
        'js/data/' + node[0] + '_' + node[1] + '.json'
      );
    });

    this.load.image('bg', 'images/bg.png');
    this.load.image("greyBall", "images/ballGrey.png");
    this.load.image("greenBall", "images/greenBall.png");
    this.load.image("launchButton", "images/launchButton.png");
    this.load.image("hotBall", "images/hotBall.png");
    this.load.spritesheet('blocks', 'images/blocks.png', { frameWidth: 53, frameHeight: 30 });

    // completed nodes (row, col) 1-based, bottom row = 1
    // levelsComplete = [
    //   [1,1],
    //   [2,1],[2,2],
    //   [3,1],[3,2],[3,3],
    //   [4,1],[4,2],[4,3],[4,4],
    //   [5,1],[5,2],[5,3],[5,4],[5,5],
    //   [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
    //   [7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],
    //   [8,1],[8,2],[8,3],[8,4],[8,5],[8,6],
    //   [9,1],[9,2],[9,3],[9,4],[9,5],
    //   [10,1],[10,2],[10,3],[10,4],
    //   [11,1],[11,2],[11,3],
    //   [12,1],[12,2],
    //   [13,1]
    // ];
  },

  create: function () {

    this.sounds = [];
    this.sound.pauseOnBlur = false;
    this.sounds["click"] = this.sound.add("click");

    this.nodes.forEach(node => {
      this.load.json(
        'level' + node[0] + '_' + node[1],
        'js/data/' + node[0] + '_' + node[1] + '.json'
      );
    });

    scene = this;
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg').setAlpha(0.6);
    this.title = scene.add.text(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 4 - 100, 'Sector Selection', {
      fontFamily: 'font1',
      fontSize: '64px',
      color: '#edf1f1ff'
    });
    this.title.setOrigin(0.5);

    this.sector = scene.add.text(80, 430, 'Sector: 1 - 1', {
      fontFamily: 'font1',
      fontSize: '24px',
      color: '#edf1f1ff'
    });

    this.status = scene.add.text(80, 470, 'Status: Active', {
      fontFamily: 'font1',
      fontSize: '24px',
      color: '#edf1f1ff'
    });

    
    this.launchButton = scene.add.image(GAME_WIDTH / 2 - 55, 580, "launchButton").setInteractive({ useHandCursor: true });

    this.launchButton.on('pointerdown', () => {
      resetStats();
      stats.currentLevel = this.selectedLevel
      scene.sounds["click"].play();
      scene.scene.stop(scene.scene.key);
      scene.scene.start('gameScene');
    });

    this.launch = scene.add.text(GAME_WIDTH / 2 - 150, 550, 'Launch!', {
      fontFamily: 'font1',
      fontSize: '48px',
      color: '#edf1f1ff'
    });
    
    this.launchButton.on('pointerover', () => {
      this.launch.setColor('#167d52');
    });
    
    this.launchButton.on('pointerout', () => {
      this.launch.setColor('#edf1f1ff');
    });
    

    this.back = scene.add.text(GAME_WIDTH - 80, 10, 'Back', {
      fontFamily: 'font1',
      fontSize: '24px',
      color: '#edf1f1ff'
    });

    this.back.setInteractive({ useHandCursor: true });
    
    this.back.on('pointerover', () => {
      this.back.setColor('#167d52');
    });
    
    this.back.on('pointerout', () => {
      this.back.setColor('#edf1f1ff');
    });
    
    this.back.on('pointerdown', () => {
      scene.sounds["click"].play();
      scene.scene.stop(scene.scene.key);
      scene.scene.start('titleScene');
    });

    this.blocks = this.add.group();

    const x = 75, y = 140, w = 625, h = 275;
    const g = this.add.graphics();

    g.lineStyle(4, 0x888888, 1); 
    g.strokeRect(x, y, w, h);

    g.fillStyle(0x000000, 1);
    g.fillRect(x + 2, y + 2, w - 4, h - 4); 

    
    this.questionMark = scene.add.text(GAME_WIDTH / 2 - 140 - 100, 550 - 280, '?', {
      fontFamily: 'font1',
      fontSize: '256px',
      color: '#edf1f1ff'
    });
    this.questionMark.setOrigin(0.5);


    const maxWidth = 7; // widest row
    const spacingX = 64;
    const spacingY = 40;
    const rows = [];

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    scene.allNodes = [];

    // build row counts: 1..maxWidth..1
    const rowCounts = [];
    for (let i = 1; i <= maxWidth; i++) rowCounts.push(i);
    for (let i = maxWidth - 1; i >= 1; i--) rowCounts.push(i);

    const totalRows = rowCounts.length;
    const topY = centerY - ((totalRows - 1) / 2) * spacingY;

    // sets for quick lookup
    const completedSet = new Set((levelsComplete || []).map(([r, c]) => `${r},${c}`));

    // 1) create all nodes
    rowCounts.forEach((count, rowIndex) => {
      // FLIP vertical placement so bottom rowIndex=0 is at the bottom
      const y = topY + (totalRows - 1 - rowIndex) * spacingY;
      const row = [];
      const totalWidth = (count - 1) * spacingX;
      const offsetX = centerX - totalWidth / 2 + 350;

      for (let i = 0; i < count; i++) {
        const x = offsetX + i * spacingX;
        const nodeLabel = `${rowIndex + 1},${i + 1}`;
        const texture = completedSet.has(nodeLabel) ? "greenBall" : "greyBall";
        node = new Node(x, y, completedSet.has(nodeLabel) ? 2 : 0, { row: rowIndex + 1, col: i + 1 }, this.cache.json.get('level' + (rowIndex + 1) + '_' + (i + 1)))
        scene.allNodes.push(node);
        row.push(node);
      }

      rows.push(row);
    });

    // 2) mark hot nodes: check row below
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return; // bottom row has no row below
      const prevRow = rows[rowIndex - 1]; // row below

      row.forEach((node, i) => {
        let connectedBelow = [];

        if (rowIndex < maxWidth) {
          // bottom half: connect to i and i-1 in prevRow
          if (i < prevRow.length) connectedBelow.push(prevRow[i]);
          if (i - 1 >= 0) connectedBelow.push(prevRow[i - 1]);
        } else {
          // top half: connect to two nearest nodes in prevRow by x distance
          const distArr = prevRow.map((p, idx) => ({ idx, dist: Math.abs(p.x - node.x) }));
          distArr.sort((a, b) => a.dist - b.dist);
          connectedBelow.push(prevRow[distArr[0].idx]);
          if (distArr.length > 1) connectedBelow.push(prevRow[distArr[1].idx]);
        }

        const anyBelowGreen = connectedBelow.some(c => c.type === 2);
        if (anyBelowGreen && node.type !== 2) node.setNodeType(1);
      });
    });

    // 3) draw dotted connections
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;
      const prevRow = rows[rowIndex - 1];

      row.forEach((node, i) => {
        if (rowIndex < maxWidth) {
          if (i < prevRow.length) drawDottedLine(prevRow[i].x, prevRow[i].y, node.x, node.y);
          if (i > 0) drawDottedLine(prevRow[i - 1].x, prevRow[i - 1].y, node.x, node.y);
        } else {
          const distArr = prevRow.map((p, idx) => ({ idx, dist: Math.abs(p.x - node.x) }));
          distArr.sort((a, b) => a.dist - b.dist);
          drawDottedLine(prevRow[distArr[0].idx].x, prevRow[distArr[0].idx].y, node.x, node.y);
          if (distArr.length > 1) drawDottedLine(prevRow[distArr[1].idx].x, prevRow[distArr[1].idx].y, node.x, node.y);
        }
      });
    });

    // helper for dotted lines
    function drawDottedLine(x1, y1, x2, y2, dash = 5, gap = 6) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const step = dash + gap;
      const steps = Math.floor(len / step);

      for (let i = 0; i <= steps; i++) {
        const curLen = i * step;
        const segLen = Math.min(dash, Math.max(0, len - curLen));
        if (segLen <= 0) continue;

        const sx = x1 + Math.cos(angle) * curLen;
        const sy = y1 + Math.sin(angle) * curLen;
        const ex = sx + Math.cos(angle) * segLen;
        const ey = sy + Math.sin(angle) * segLen;

        scene.add.line(0, 0, sx, sy, ex, ey, 0xffffff).setOrigin(0, 0).setLineWidth(1);
      }
    }
    new ProgressBar(820, 665, 350, 30, Math.floor(levelsComplete.length / scene.allNodes.length * 100));
    if (levelsComplete.length === 0) {
      scene.allNodes[0].setNodeType(1)
    }
    scene.allNodes[0].activate() 
  }
});