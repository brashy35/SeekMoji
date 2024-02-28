let emojis = []; // Array to hold both target and clutter emojis
let lives = 3; // Number of lives
let gameState = "start"; // Possible states: "start", "running", "gameOver", "won"
let targetEmojis = ['👽','👾','👩🏻‍🚀','🧑🏽‍🚀','👨🏿‍🚀']; // Emojis players must find 
let clutterEmojis = []; // Clutter emojis
let foundTargets = 0; // Counter for found target emojis
let stopwatchStart = false;
let startTime;
let elapsedTime = 0;
let finalFormattedTime = "";
let foundEmojis = []; // Initialize the array to track found target emojis
let bgImage; // Variable to hold the background image
let spriteImages = {}; // Object to store loaded images

function preload() {
    bgImage = loadImage('static/backgrounds/pexels-francesco-ungaro-998641.jpg'); // Background
    spriteImages['red_spaceship'] = loadImage('static/sprites/red_spaceship.png');
    spriteImages['other_spaceship'] = loadImage('static/sprites/5219396.png');

}

function setup() {
    createCanvas(600, 800);
    document.querySelector('canvas').id = 'myCanvas';
}


function draw() {
    background(255); // Set the background color
    
    // Define button and icon positions and dimensions
    let startButtonX = width / 2 - 95;
    let startButtonY = height / 2;
    let startButtonWidth = 200;
    let startButtonHeight = 50;

    let shareButtonX = width / 2 - 95;
    let shareButtonY = height / 2 + 100;
    let shareButtonWidth = 200;
    let shareButtonHeight = 50;

    let questionMarkX = width - 40;
    let questionMarkY = 20;
    let questionMarkSize = 30;

    let resultsButtonX = 30; // X position of the Results button
    let resultsButtonY = 10; // Y position of the Results button
    let resultsButtonWidth = 100; // Width of the Results button
    let resultsButtonHeight = 40; // Height of the Results button

    // Draw game elements
    if (gameState === "running") {
        let gameAreaTop = 60;
        let gameAreaBottom = height-60;
        
        image(bgImage, 0, gameAreaTop, width, gameAreaBottom - gameAreaTop);
        displayEmojis();
        displaySprites();
        displayUI();
    } else {
        if (gameState === "start") {
            displayStartScreen();
        } else if (gameState === "gameOver" || gameState === "won") {
            if (gameState === "gameOver") {
                let gameAreaTop = 60;
                let gameAreaBottom = height-60;

                image(bgImage, 0, gameAreaTop, width, gameAreaBottom - gameAreaTop);
                displayEmojis();
                displaySprites();
                displayUI();

                displayGameOver();
            } else {
                let gameAreaTop = 60;
                let gameAreaBottom = height-60;
        
                image(bgImage, 0, gameAreaTop, width, gameAreaBottom - gameAreaTop);
                displayEmojis();
                displaySprites();
                displayUI();

                displayGameWon();
            }
            displayCopyMessage();
        }
    }

    // Only draw and check hover for the Results button if the game state allows it
    if (gameState === "gameOver" || gameState === "won") {
        drawResultsButton();
    }

    // Draw question mark
    drawQuestionMark();

    // Now, correctly call checkHoverAndSetCursor with all necessary parameters
    checkHoverAndSetCursor(startButtonX, startButtonY, startButtonWidth, startButtonHeight, questionMarkX, questionMarkY, questionMarkSize, shareButtonX, shareButtonY, shareButtonWidth, shareButtonHeight, resultsButtonX, resultsButtonY, resultsButtonWidth, resultsButtonHeight);
}

// Consolidate hover logic and cursor update in a single function
function checkHoverAndSetCursor(startButtonX, startButtonY, startButtonWidth, startButtonHeight, questionMarkX, questionMarkY, questionMarkSize, shareButtonX, shareButtonY, shareButtonWidth, shareButtonHeight, resultsButtonX, resultsButtonY, resultsButtonWidth, resultsButtonHeight) {
    // Check hover over start button
    let overStartButton = mouseX > startButtonX && mouseX < startButtonX + startButtonWidth && mouseY > startButtonY && mouseY < startButtonY + startButtonHeight;

    // Check hover over share button (only if relevant)
    let overShareButton = (gameState === "gameOver" || gameState === "won") && mouseX > shareButtonX && mouseX < shareButtonX + shareButtonWidth && mouseY > shareButtonY && mouseY < shareButtonY + shareButtonHeight;

    // Check hover over question mark
    let overQuestionMark = dist(mouseX, mouseY, questionMarkX, questionMarkY) < questionMarkSize / 2;

    // Check hover over results button
    let overResultsButton = mouseX > resultsButtonX && mouseX < resultsButtonX + resultsButtonWidth && mouseY > resultsButtonY && mouseY < resultsButtonY + resultsButtonHeight;

    // Set cursor based on hover status
    if (overStartButton || overShareButton || overQuestionMark || overResultsButton) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    drawRules();
}



function displayUI() {
    displayLives();
    displayStopwatch();
    displayTargetEmojis();
    displayFoundEmojis();
}

function displayStartScreen() {
    background(240,240,240); // Change to a gray background
    fill(0);
    textSize(38);
    textAlign(CENTER, CENTER);
    text("Welcome to SeekMoji", width / 2, height / 2 - 100);

    fill(0);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Ready to begin?", width / 2, height / 2 - 60);

    drawStartButton();
}

function drawStartButton() {
    let buttonX = width / 2 - 95;
    let buttonY = height / 2;
    let buttonWidth = 200;
    let buttonHeight = 50;
    fill(0); // Button color
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); // Rounded corners
    fill(255); // Text color
    textSize(20);
    text("START", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
    handleInteraction(mouseX, mouseY);
}

function touchStarted() {
    // Check if there's at least one touch point
    if (touches.length > 0) {
        const {x, y} = touches[0]; // Get the first touch point
        handleInteraction(x, y);
        return false; // Prevent default behavior (optional, depending on your needs)
    }
}

function initializeGame() {
    stopwatchStart = true; // Start the stopwatch
    startTime = millis(); // Reset the start time
    generateEmojis(); // Set emoji positions
    generateSprites(); // Populate sprites array
    gameState = "running"; // Change game state to running
}


function generateEmojis() {
    let targetPositions = [
        { emoji: '👽', x: 258, y: 230 },
        { emoji: '👾', x: 70, y: 667 },
        { emoji: '👩🏻‍🚀', x: 310, y: 710 },
        { emoji: '🧑🏽‍🚀', x: 398, y: 478 },
        { emoji: '👨🏿‍🚀', x: 50, y: 250 }
    ];

    let clutterPositions = [
        { emoji: '🪐', x: 50, y: 250 },
        { emoji: '☄️', x: 150, y: 600 },
        { emoji: '🛸', x: 250, y: 380 },
        { emoji: '🛰️', x: 350, y: 400 },
        { emoji: '🚀', x: 100, y: 100 },
        { emoji: '✨', x: 315, y: 715 },
        { emoji: '⭐️', x: 300, y: 720 },
        { emoji: '🌟', x: 330, y: 725 },
        { emoji: '✨', x: 75, y: 300 },
        { emoji: '⭐️', x: 20, y: 120 },
        { emoji: '🌟', x: 460, y: 650 },
        { emoji: '✨', x: 350, y: 200 },
        { emoji: '⭐️', x: 60, y: 200 },
        { emoji: '🌟', x: 480, y: 300 },
        { emoji: '✨', x: 270, y: 560 },
        { emoji: '⭐️', x: 180, y: 500 },
        { emoji: '🌟', x: 220, y: 220 },
        { emoji: '🌚', x: 180, y: 250 },
        { emoji: '🌝', x: 20, y: 510 },
        { emoji: '🌛', x: 390, y: 720 },
        { emoji: '🌜', x: 375, y: 720 },
        { emoji: '🌞', x: 140, y: 290 },
    ];

    // Add target emojis with their positions
    targetPositions.forEach(tp => {
        emojis.push({ emoji: tp.emoji, x: tp.x, y: tp.y, found: false });
    });

    // Add clutter emojis with their positions
    clutterPositions.forEach(cp => {
        emojis.push({ emoji: cp.emoji, x: cp.x, y: cp.y, found: false });
    });
}

function generateSprites() {
    sprites = [
        { type: 'red_spaceship', x: 305, y: 450, width: 100, height: 100 },
        { type: 'other_spaceship', x: 235, y: 570, width: 150, height: 150 },

    ];
}

function displayEmojis() {
    push();
    textSize(24);
    emojis.forEach(({ emoji, x, y, found }) => {
        if (!found || clutterEmojis.includes(emoji)) {
            text(emoji, x, y);
        }
    });
    pop();
}

function displaySprites() {
    sprites.forEach(sprite => {
        let img = spriteImages[sprite.type];
        image(img, sprite.x, sprite.y, sprite.width, sprite.height);
    });
}

function displayLives() {
    // Display full hearts for remaining lives and broken hearts for lost lives
    let livesDisplay = "❤️".repeat(lives) + "💔".repeat(3 - lives);

    fill(0); // Set text color
    textSize(32); // Set text size
    textAlign(LEFT, TOP); // Set text alignment
    text(livesDisplay, 250, 20); // Position the lives display
}


function displayStopwatch() {
    if (stopwatchStart) {
        let currentTime = millis() - startTime;
        let seconds = Math.floor(currentTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Get the remainder of seconds after converting to minutes
        let formattedTime = nf(minutes, 2) + ':' + nf(seconds, 2); // Format the time to ensure it always displays as two digits
        fill(0); // Text color
        textSize(30);
        text(formattedTime, 30, 20); // Display the formatted time (location)
    }
}


function displayFoundEmojisWinScreen() {
    push();
    let emojiDisplaySize = 32; // Set text size for emojis
    textSize(emojiDisplaySize);
    let displayMargin = 10; // Margin between displayed emojis

    // Calculate the total width of the found emojis display
    let totalDisplayWidth = foundEmojis.length * emojiDisplaySize + (foundEmojis.length - 1) * displayMargin;

    // Start X position to center the emojis
    let startX = (width / 2) - (totalDisplayWidth / 2) + 20;
    let startY = height / 2 + 15; // Adjust Y position to display below the win message and time, ensuring it doesn't overlap

    foundEmojis.forEach((emojiObj, index) => {
        // Calculate the x position for each emoji based on its index
        let x = startX + (index * (emojiDisplaySize + displayMargin));
        fill('black'); // Set emoji color
        text(emojiObj.emoji, x, startY);
    });
    pop();
}

function captureFinalTime() {
    if (!finalFormattedTime && stopwatchStart) {
        stopwatchStart = false; // Stop the stopwatch
        let finalTime = millis() - startTime;
        let seconds = Math.floor(finalTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Remaining seconds after minutes are accounted for

        // Format the final time as MM:SS
        finalFormattedTime = nf(minutes, 2) + ':' + nf(seconds, 2);
    }
}

function displayTargetEmojis() {
    let emojiDisplaySize = 24; // Size for emoji display
    textSize(emojiDisplaySize); // Set text size for emojis
    textAlign(CENTER, CENTER); // Align text for consistent display

    // Filter out found emojis to calculate display width dynamically
    let unfoundEmojis = targetEmojis.filter(emoji => !foundEmojis.find(e => e.emoji === emoji));

    // Fixed starting X position for the first emoji
    let fixedStartX = 20; // Adjust this to set where you want the first emoji to appear

    // Dynamically adjust Y position if needed (e.g., if you want it closer to the bottom UI elements)
    let yPosition = 770; // Adjust this value based on your new layout

    // Dynamically display each unfound target emoji
    unfoundEmojis.forEach((emoji, index) => {
        let x = fixedStartX + (index * (emojiDisplaySize + 10)); // Adjust spacing between emojis if needed
        text(emoji, x, yPosition); // Display the emoji
    });
}

function displayFoundEmojis() {
    let emojiDisplaySize = 24; // Size for the found emojis display
    textSize(emojiDisplaySize); // Set text size for emojis
    textAlign(CENTER, CENTER); // Align text for consistent display

    let displayMargin = 10; // Margin between displayed emojis
    // Calculate the total width needed to display all found emojis side by side
    let totalDisplayWidth = (foundEmojis.length * emojiDisplaySize) + ((foundEmojis.length - 1) * displayMargin);
    let startX = width - totalDisplayWidth; // Positioning found emojis at the top right

    // Display each found emoji
    foundEmojis.forEach((emojiObj, index) => {
        // Calculate the x position for each emoji based on its index
        let x = startX + (index * (emojiDisplaySize + displayMargin));

        // Draw the emoji
        text(emojiObj.emoji, x, 770);
    });
}

function drawButton() {
    let buttonX = width / 2 - 95; // Button X position
    let buttonY = height / 2 + 100; // Button Y position
    let buttonWidth = 200; // Button width
    let buttonHeight = 50; // Button height

    fill(0); // Button color black
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); // Draw button with rounded corners

    fill(255); // Text color
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Share Results", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

// Global variable to track clipboard copy status
let isCopiedToClipboard = false;

function shareResults() {
    let resultText; // Variable for the first row of the share text
    let livesIndicator = "❤️".repeat(lives) + "💔".repeat(3 - lives); // Display lives as hearts and lost lives as broken hearts

    // Check the game state
    if (gameState === "won") {
        resultText = `SeekMoji 1 | ${finalFormattedTime}`; // Final formatted time for wins
    } else if (gameState === "gameOver") {
        resultText = "SeekMoji 1 | X"; // Use an "X" for game over scenarios
    }

    let foundEmojiString = foundEmojis.map(emoji => emoji.emoji).join(' '); // Creates a string of found emojis

    let shareText = `${resultText}\n${livesIndicator}\n${foundEmojiString}`;

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(shareText).then(() => {
        console.log("Results copied to clipboard successfully.");
        isCopiedToClipboard = true; // Set the flag to true on successful copy
        setTimeout(() => isCopiedToClipboard = false, 3000); // Reset the flag after 3 seconds
    }).catch(err => {
        console.error("Failed to copy results to clipboard.", err);
    });
}

function displayCopyMessage() {
    if (isCopiedToClipboard) {
        // Coordinates just below the "Share Results" button
        let messageX = width / 2 + 6;
        let messageY = height / 2 + 180; // Adjust this based on the share button's position
        
        fill(0); // Text color
        textSize(16); // Adjust as needed
        textAlign(CENTER, CENTER);
        text("Results copied to clipboard", messageX, messageY);
    }
}


function drawQuestionMark() {
    push(); // Save the current drawing state
    // Coordinates and size for the question mark icon
    let iconX = width - 40; // Adjust based on canvas size
    let iconY = 20;
    let iconSize = 30;

    // Draw circle background
    fill(255); // White background
    stroke(0); // Black border
    ellipse(iconX, iconY + 10, iconSize, iconSize);

    // Draw question mark
    fill(0); // Black question mark
    textSize(20);
    textAlign(CENTER, CENTER);
    text('?', iconX, iconY + 10); // Adjust Y to center the question mark
    pop(); // Restore the drawing state
}


let showRules = false; // Flag to track rules display state

function toggleRulesDisplay() {
    showRules = !showRules; // Toggle the state
}

function drawRules() {
    if (!showRules) return; // If not showing rules, exit function

    push(); // Save the current drawing state
    // Display settings for the rules box
    fill(255); // White background
    stroke(0); // Black border
    rect(50, 50, width - 100, height - 100, 20); // Adjust size as needed

    // Rules text
    fill(0); // Black text
    textSize(20);
    textAlign(LEFT, TOP);
    text(`HOW TO PLAY:
    - Seek the target emojis! (bottom left of screen)
    - Tap the target emojis. Avoid tapping other items!
    - You have 3 lives. Tapping wrong items costs a life.
    - After the game, share your results with friends!`, 60, 300); // Adjust positioning and content
    pop(); // Restore the drawing state
}


let showGameOverBox = false; // Flag to track game over box display state

function displayGameOver() {
    let unfoundEmojiPositions = emojis.filter(emoji => !emoji.found && targetEmojis.includes(emoji.emoji)).map(emoji => ({x: emoji.x, y: emoji.y}));

    drawRedCircles(unfoundEmojiPositions);

    if (!showGameOverBox) return; // If not showing game over box, exit function

    let boxHeight = (height / 2); // Adjust the box height here
    let boxY = (height - boxHeight) / 2; // Center the box vertically

    push(); // Save the current drawing state
    fill(255); // White background for the box
    stroke(0); // Black border for the box
    rect(50, boxY, width - 100, boxHeight, 20); // Adjusted box height and Y position

    fill(0); // Black text
    textSize(48); // Set the text size for the game over message
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, boxY + 150); // Adjust Y position based on the new box position

    // Adjust the Y position where the found emojis are displayed within the game over box
    displayFoundEmojisWinScreen(); // Ensure this function positions text appropriately within the new box dimensions

    // Adjust the position of the "Share Results" button to fit within the new box dimensions
    drawButton(); // Share results
    pop();
}

let showGameWonBox = false; // Flag to track game over box display state

function displayGameWon() {
    if (!showGameWonBox) return; // If not showing game over box, exit function

    let boxHeight = (height / 2); // Adjust the box height here
    let boxY = (height - boxHeight) / 2; // Center the box vertically

    push(); // Save the current drawing state
    fill(255); // White background for the box
    stroke(0); // Black border for the box
    rect(50, boxY, width - 100, boxHeight, 20); // Adjusted box height and Y position

    fill(0); // Black text
    textSize(48); // Set the text size for the game over message
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, boxY + 50); // Adjust Y position based on the new box position

    textSize(32);
    text(`Time: ${finalFormattedTime}`, width / 2, height / 2 - 50);

    // Adjust the Y position where the found emojis are displayed within the game over box
    displayFoundEmojisWinScreen(); // Ensure this function positions text appropriately within the new box dimensions

    // Adjust the position of the "Share Results" button to fit within the new box dimensions
    drawButton(); // Share results
    pop();
}


// for screen taps
function handleInteraction(x, y) {
    // Check if the game over box is visible
    if (showGameOverBox) {
        // Define the game over box boundaries
        let boxHeight = (height / 2); // Same as defined in displayGameOver
        let boxY = (height - boxHeight) / 2; // Center the box vertically
        let boxLeft = 50;
        let boxRight = width - 50;
        let boxTop = boxY;
        let boxBottom = boxY + boxHeight;

        // Check if the click is outside the game over box
        if (x < boxLeft || x > boxRight || y < boxTop || y > boxBottom) {
            showGameOverBox = false; // Hide the game over box
            return; // Prevent further click processing
        }
    }

    // Check if the game over box is visible
    if (showGameWonBox) {
        // Define the game over box boundaries
        let boxHeight = (height / 2); // Same as defined in displayGameWon
        let boxY = (height - boxHeight) / 2; // Center the box vertically
        let boxLeft = 50;
        let boxRight = width - 50;
        let boxTop = boxY;
        let boxBottom = boxY + boxHeight;

        // Check if the click is outside the game over box
        if (x < boxLeft || x > boxRight || y < boxTop || y > boxBottom) {
            showGameWonBox = false; // Hide the game over box
            return; // Prevent further click processing
        }
    }




    // Define the rules box boundaries
    let rulesBoxLeft = 50;
    let rulesBoxRight = width - 50;
    let rulesBoxTop = 50;
    let rulesBoxBottom = height - 50;

    // Check if the rules box is displayed and the click is outside of it
    if (showRules && (x < rulesBoxLeft || x > rulesBoxRight || y < rulesBoxTop || y > rulesBoxBottom)) {
        showRules = false; // Hide the rules box
        return; // Exit the function to prevent further interaction handling
    } else if (showRules) {
        // If the rules box is open and the click is inside, just return to prevent any action
        return;
    }

    // Define the game area top boundary
    let gameAreaTop = 60; // Adjust this value based on your UI layout
    let gameAreaBottom = height-60;

    // Only proceed if the click is within the canvas
    if (x >= 0 && x <= width && y >= gameAreaTop && y <= gameAreaBottom) {
        // Variables for the "Start" button position and dimensions
        let startButtonX = width / 2 - 95;
        let startButtonY = height / 2;
        let startButtonWidth = 200;
        let startButtonHeight = 50;

        // Check if the "Start" button is clicked
        if (gameState === "start" && x > startButtonX && x < startButtonX + startButtonWidth &&
            y > startButtonY && y < startButtonY + startButtonHeight) {
            initializeGame();
            return; // Exit the function to prevent further checks
        }

        if (gameState === "running") {
            let clickedOnTarget = false;
            let clickedOnBackground = true; // Assume a click on the background initially

            // Check if the click is on a target emoji
            emojis.forEach(emoji => {
                let clickRadius = 16;
                if (dist(x, y, emoji.x, emoji.y) < clickRadius && targetEmojis.includes(emoji.emoji) && !emoji.found) {
                    if (!emoji.found) {
                        emoji.found = true;
                        clickedOnTarget = true;
                        clickedOnBackground = false; // Click was on an emoji, not the background
                        foundEmojis.push(emoji);
                        foundTargets++;
                        if (foundTargets === targetEmojis.length) {
                            gameState = "won";
                            showGameWonBox = true;
                            captureFinalTime();
                        }
                    }
                }
            });

            // Deduct a life if the click was on the background and not on a target emoji
            if (clickedOnBackground && !clickedOnTarget) {
                lives--;
                if (lives === 0) {
                    gameState = "gameOver";
                    showGameOverBox = true;
                    captureFinalTime();
                }
            }
        }

        // Check if "Share Results" button is clicked in "gameOver" or "won" state
        let shareButtonX = width / 2 - 100;
        let shareButtonY = height / 2 + 100;
        let shareButtonWidth = 200;
        let shareButtonHeight = 50;

        if ((gameState === "gameOver" || gameState === "won") && x > shareButtonX && x < shareButtonX + shareButtonWidth &&
            y > shareButtonY && y < shareButtonY + shareButtonHeight) {
            shareResults();
        }
    }

    // for help icon
    // Icon coordinates and size (must match those in drawQuestionMark)
    let iconX = width - 40;
    let iconY = 20;
    let iconSize = 30;

    // Calculate distance from icon center to mouse click
    let d = dist(x, y, iconX, iconY);

    // Check if click is within icon bounds
    if (d < iconSize / 2 +10) {
        // Clicked on question mark, toggle rules display
        toggleRulesDisplay();
    }



    let resultsButtonX = 30;
    let resultsButtonY = 10;
    let resultsButtonWidth = 100;
    let resultsButtonHeight = 40;

    if ((gameState === "gameOver") && x > resultsButtonX && x < resultsButtonX + resultsButtonWidth &&
        y > resultsButtonY && y < resultsButtonY + resultsButtonHeight) {
        showGameOverBox = true;
    }
    if ((gameState === "gameWon") && x > resultsButtonX && x < resultsButtonX + resultsButtonWidth &&
    y > resultsButtonY && y < resultsButtonY + resultsButtonHeight) {
        showGameWonBox = true;
    }
}


function drawResultsButton() {
    let buttonX = 30;
    let buttonY = 10;
    let buttonWidth = 100;
    let buttonHeight = 40;
    fill(0); // Button color
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); // Rounded corners
    fill(255); // Text color
    textSize(16);
    text("Results", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function drawRedCircles(positions) {
    push(); // Save current drawing settings
    noFill(); // Ensure the circles aren't filled
    stroke(255, 0, 0); // Set the stroke color to red
    strokeWeight(2); // Set the stroke thickness
    
    // Iterate through the array of positions and draw a circle at each one
    for (let pos of positions) {
      ellipse(pos.x, pos.y, 50, 50); // Draw the circle with a diameter of 100
    }
    
    pop(); // Restore previous drawing settings
  }
  
  
