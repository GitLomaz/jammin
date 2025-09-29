const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const DEBUG = false;
let scene;

const SCORE_SIDEBAR_WIDTH = 256;
const PLAY_AREA_WIDTH = 1024;
const PLAY_AREA_HEIGHT = 720;
let playerName = false;
let muteAll = localStorage.getItem('muteAll') === 'true' || false;
let levelsComplete = JSON.parse(localStorage.getItem('levelsComplete')) || [];
let music = false;

let stats = {
  score: 0,
  lives: 3,
  currentLevel: [1, 1]
}

let unlockAll = true