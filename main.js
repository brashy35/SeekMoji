import './style.css'
import Phaser from 'phaser'

// size of canvas - need to alter so it is consistently same distance from top and bottom ui
const sizes = {
  width: 500,
  height: 500
}

// clutter images
const clutterImages = [
  'fly',
  'cricket'
];

// mapping target names to emojis
const targetToEmoji = {
  worm: '🪱',
  cockroach: '🪳',
  beetle: '🪲',
  spider: '🕷',
  ant: '🐜'
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.gameOver = false;
    this.targets = [];
    this.lives = 3;
    this.targetsFound = 0;
    this.totalTargets = 5;
  }

  preload() {
    // background image preload
    this.load.image("bg", "/assets/bg.jpg")

    // clutter images preload
    clutterImages.forEach(key => {
      this.load.image(key, `/assets/clutter/${key}.png`);
    });

    // target images preload
    Object.entries(targetToEmoji).forEach(([key, _]) => {
      this.load.image(key, `/assets/targets/${key}.png`);
    });
  }

  create() {
    // >x = right, <x = left
    // >y = down, <y = up
    // >scale = bigger, <scale = smaller

    // background image: always set to 0, 0
    this.add.image(0, 0, "bg").setOrigin(0,0)

    // clutter images: positions and scales
    this.add.image(50, 140, "fly").setOrigin(0,0).setScale(.1).setDepth(1)
    this.add.image(400, 240, "cricket").setOrigin(0,0).setScale(.16).setDepth(1)
    
    // target images: positions and scales
    let targets = [
      {name: 'worm', x: 120, y: 350, scale: 0.1},
      {name: 'cockroach', x: 400, y: 260, scale: 0.1},
      {name: 'beetle', x: 150, y: 105, scale: 0.02},
      {name: 'spider', x: 30, y: 230, scale: 0.07},
      {name: 'ant', x: 350, y: 400, scale: 0.03},
    ];

    // MOUSE CLICKS AND GAMEPLAY ************************************************************************************
    targets.forEach((targetInfo) => {
      let target = this.add.image(targetInfo.x, targetInfo.y, targetInfo.name).setOrigin(0,0).setScale(targetInfo.scale).setInteractive();
      this.targets.push({ sprite: target, found: false });
    
      target.on('pointerdown', () => {
        target.disableInteractive(); // prevent further clicks on this target
        target.setVisible(false); // make invisible
    
        this.targetsFound++; // increment count of found targets
        const targetIndex = this.targets.findIndex(t => t.sprite === target);
        
        if (targetIndex !== -1) {
          this.targets[targetIndex].found = true;
        }
        // find the emoji for this target and remove it from the array
        const emoji = targetToEmoji[targetInfo.name];

        foundEmojis.push(emoji); // add the found emoji to the array
        updateFoundEmojisDisplay();

        targetEmojis = targetEmojis.filter(e => e !== emoji);
        updateTargetEmojisDisplay(); // update the display of target emojis

        if (this.targetsFound === this.totalTargets) { // if all targets found, game won
          this.showWinModal();
        }
      });
    });
    
    this.input.on('pointerdown', (pointer) => {
      if (isModalOpen) return; // if help box is open, don't mess with game canvas
      
      const clickedTargetIndex = this.targets.findIndex(target => target.sprite.getBounds().contains(pointer.x, pointer.y) && !target.found);
      
      if (clickedTargetIndex === -1) { // if no target found at click location
        this.lives--; // decrement lives
        loseLife(); // update lives display
    
        if (this.lives === 0) { // if 0 lives, game over
          this.showLoseModal();
        }
      }
    });
  }
  // ****************************************************************************************************************

  // WIN SCREEN *****************************************************************************************************
  showWinModal() {
    if (!this.gameOver) { // check if the game is not already over
      this.gameOver = true; // set the game over flag
      document.getElementById('gameWinModal').style.display = 'block';

      document.getElementById('winTime').textContent = `Time: ${stopwatch.toString()}`;
      document.getElementById('winEmojis').textContent = `${foundEmojis.join(' ')}`;

      document.querySelector('#gameWinModal .close-button').addEventListener('click', function() {
        document.getElementById('gameWinModal').style.display = 'none';
      });

      this.input.enabled = false; // disable further input
      stopwatch.stop();
    }
  }
  // ****************************************************************************************************************

  // GAME OVER SCREEN ***********************************************************************************************
  showLoseModal() {
    if (!this.gameOver) {
      this.gameOver = true;
      document.getElementById('gameLoseModal').style.display = 'block';

      document.getElementById('loseEmojis').textContent = `${foundEmojis.join(' ')}`;

      document.querySelector('#gameLoseModal .close-button').addEventListener('click', function() {
        document.getElementById('gameLoseModal').style.display = 'none';
      });

      this.input.enabled = false;
      stopwatch.stop();
    }
  }
  // ****************************************************************************************************************

  update() {
    if (this.gameOver) return;
  }
}

// STOPWATCH STUFF **************************************************************************************************
class Stopwatch {
  constructor(displayElement) {
      this.displayElement = displayElement;
      this.startTime = 0;
      this.elapsedTime = 0;
      this.timerId = null;
  }

  start() {
      if (!this.timerId) {
          this.startTime = Date.now() - this.elapsedTime;
          this.timerId = setInterval(() => {
              this.elapsedTime = Date.now() - this.startTime;
              this.display();
          }, 1000);
      }
  }

  stop() {
      clearInterval(this.timerId);
      this.timerId = null;
  }

  reset() {
      this.stop();
      this.elapsedTime = 0;
      this.display();
  }

  display() {
      const timeString = this.toString();
      this.displayElement.textContent = `Time: ${timeString}`;
  }

  toString() {
      const seconds = Math.floor(this.elapsedTime / 1000) % 60;
      const minutes = Math.floor(this.elapsedTime / 60000) % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

const stopwatchDisplay = document.getElementById('stopwatch');
const stopwatch = new Stopwatch(stopwatchDisplay);
// ******************************************************************************************************************

// LIVES STUFF ******************************************************************************************************
let lives = 3;

function renderLives() {
    return '❤️'.repeat(lives) + '💔'.repeat(3 - lives);
}

function loseLife() {
    lives = Math.max(0, lives - 1); // ensure lives can't be negative
    document.getElementById("lives").textContent = renderLives();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lives").textContent = renderLives();
});
// ******************************************************************************************************************

// HELP BUTTON STUFF ************************************************************************************************
let isModalOpen = false; // flag to track modal visibility

// event listener for OPENING the help box
document.getElementById('help').addEventListener('click', function() {
  document.getElementById('rulesModal').style.display = 'flex'; // show the help box
  isModalOpen = true; // update the flag to indicate the modal is open
  stopwatch.stop();
});

// event listener for CLOSING the help box, using the close button
document.querySelector('#rulesModal .close-button').addEventListener('click', function() {
  document.getElementById('rulesModal').style.display = 'none'; // hide the rules modal
  isModalOpen = false; //uUpdate the flag to indicate the modal is closed
  stopwatch.start();
});

// global click event listener to close modal if clicked outside, and also preventing game canvas interaction
window.onclick = function(event) {
  const modal = document.getElementById('rulesModal');
  if (event.target === modal) {
    modal.style.display = 'none';
    isModalOpen = false; // update the flag as the modal is closed
    event.stopPropagation(); // prevent click from being detected by the game canvas
  }
};
// ******************************************************************************************************************

// BOTTOM UI STUFF **************************************************************************************************
let targetEmojis = Object.values(targetToEmoji);
let foundEmojis = [];

function updateTargetEmojisDisplay() {
  document.getElementById('targetEmojis').textContent = targetEmojis.join(' ');
}

function updateFoundEmojisDisplay() {
  document.getElementById('foundEmojis').textContent = foundEmojis.join(' ');
}

document.addEventListener('DOMContentLoaded', () => {
  updateTargetEmojisDisplay();
  updateFoundEmojisDisplay();
});
// ******************************************************************************************************************

// SHARE BUTTON STUFF ***********************************************************************************************
function setupShareButton(shareButtonId, getResultsString) {
  const shareButton = document.getElementById(shareButtonId);
  const messageElement = document.createElement("div");

  messageElement.textContent = "Results copied to clipboard";
  messageElement.style.display = "none"; // hidden initially
  messageElement.style.marginTop = "10px"; // add a space above the messsage
  messageElement.style.fontSize = "12px";

  shareButton.parentNode.appendChild(messageElement);

  shareButton.addEventListener('click', () => {
    const resultsString = getResultsString(); // generate results string

    navigator.clipboard.writeText(resultsString).then(() => {
      messageElement.style.display = "block"; // show message below button
      setTimeout(() => { messageElement.style.display = "none"; }, 2000); // hide message after 2 seconds
    }).catch(err => {
      console.error('Failed to copy results: ', err);
    });
  });
}
// ******************************************************************************************************************

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,

  scene: [GameScene]
}

window.onload = () => {
  const startButton = document.getElementById('startGameButton');
  const gameStartScreen = document.getElementById('gameStartScreen');

  startButton.addEventListener('click', () => {
    stopwatch.start();
    gameStartScreen.style.display = 'none'; // hide the start screen
    new Phaser.Game(config);
  });

  // generate win results string
  const getWinResultsString = () => {
    return `SeekMoji 2 | ${stopwatch.toString()}\n${renderLives()}\n${foundEmojis.join(' ')}`;
  };
  
  // generate lose results string
  const getLoseResultsString = () => {
    return `SeekMoji 2 | X\n${renderLives()}\n${foundEmojis.join(' ')}`;
  };

  setupShareButton("winShareBtn", getWinResultsString);
  setupShareButton("loseShareBtn", getLoseResultsString);
};