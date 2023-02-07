const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');

// updating the screen 7 times a second
let speed = 7;

// how many tiles in a row/column
let tileCount = 30;
// size of one tile
let tileSize = canvas.width / tileCount - 2;
// snake will be centered : 600width / 30tiles = 20px/tile
let headX = 10;
let headY = 10;

let xVelocity = 0;
let yVelocity = 0;

// game loop function
const drawGame = () => {
    clearScreen();
    changeSnakePosition();
    drawSnake();
    // refresh page 7 times a second to move the snake
    setTimeout(drawGame, 1000 / speed);
};

const clearScreen = () => {
    ctx.fillStyle = "#D8D8D8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
};

const changeSnakePosition = () => {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
};

const keyDown = (event) => {
    // up
    if (event.keyCode === 38) {
        // preventing to go down by exiting the keyDown function with return
        if (yVelocity === 1) {
            return;
        }
        // -1 --> y decrease
        yVelocity = -1;
        // stop moving on the x
        xVelocity = 0;
    }

    // down
    if (event.keyCode === 40) {
        if (yVelocity === -1) {
            return;
        }
        // 1 --> y increase
        yVelocity = 1;
        xVelocity = 0;
    }

    // left
    if (event.keyCode === 37) {
        if (xVelocity === 1) {
            return;
        }
        yVelocity = 0;
        xVelocity = -1;
    }

    // right
    if (event.keyCode === 39) {
        if (xVelocity === -1) {
            return;
        }
        yVelocity = 0;
        xVelocity = 1;
    }
};

document.body.addEventListener('keydown', keyDown);

drawGame();