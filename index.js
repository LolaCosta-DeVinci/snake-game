const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');


class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// updating the screen 7 times a second
let speed = 7;

// number of tiles in a row/column
let tileCount = 20;
// size of one tile
let tileSize = canvas.width / tileCount - 2;
// snake will be centered : 600width / 30tiles = 20
let headX = 10;
let headY = 10;
const snakeParts = [];
// snake tail length
let tailLength = 2;

let appleX = 5;
let appleY = 5;

// directions of snake
let xVelocity = 0;
let yVelocity = 0;

let previousXVelocity = 0;
let previousYVelocity = 0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");
const hitSound = new Audio("punch.mp3");
const gameStartSound = new Audio("game-start.mp3");

// game loop function
const drawGame = () => {
    //Was moving right and try to move left
    if (previousXVelocity === 1 && xVelocity === -1) {
        xVelocity = previousXVelocity;
    }

    //Was moving left and try to move right
    if (previousXVelocity === -1 && xVelocity === 1) {
        xVelocity = previousXVelocity;
    }

    //Was moving up and try to move down
    if (previousYVelocity === -1 && yVelocity === 1) {
        yVelocity = previousYVelocity;
    }

    //Was moving down and try to move up
    if (previousYVelocity === 1 && yVelocity === -1) {
        yVelocity = previousYVelocity;
    }

    previousXVelocity = xVelocity;
    previousYVelocity = yVelocity;

    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        hitSound.play();
        document.body.removeEventListener('keydown', keyDown);
        return;
    }

    clearScreen();

    checkAppleCollision();
    drawApple();
    drawSnake();

    drawScore();

    // difficulty increase
    if (score > 2) {
        speed = 11;
    }
    if (score > 5) {
        speed = 15;
    }
    if (score > 20) {
        speed = 18;
    }

    // refresh page 7 times a second to move the snake
    setTimeout(drawGame, 1000 / speed);
};

const isGameOver = () => {
    let gameOver = false;

    // checking if game has started
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // walls
    if (headX < 0) {
        // hitSound.play();
        gameOver = true;
    } else if (headX === tileCount) {
        // hitSound.play();
        gameOver = true;
    } else if (headY < 0) {
        // hitSound.play();
        gameOver = true;
    } else if (headY === tileCount) {
        // hitSound.play();
        gameOver = true;
    }

    // snake body
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        // checkin if this part.x position is occupying that headX position
        if (part.x === headX && part.y === headY) {
            // hitSound.play();
            gameOver = true;
            break; // stop looping
        }
    }


    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '60px Verdana';

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // Fill with gradient
        ctx.fillStyle = gradient;

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);

        ctx.font = 'italic 25px Verdana';
        ctx.fillText("Press space", canvas.width / 2.5, canvas.height / 2 + 30);
    }

    return gameOver;
};

const drawScore = () => {
    ctx.fillStyle = 'white';
    ctx.font = '15px Verdana';
    ctx.fillText(`Score ${score}`, canvas.width - 70, 15);
};

const clearScreen = () => {
    ctx.fillStyle = "#1B1B1B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
    // body parts
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    // adding the part to the body where the head was just before
    snakeParts.push(new SnakePart(headX, headY)); // put an item at the end of the list, next to the head
    // removing the first item in the list --> the oldest item, the furthest item from the head
    // mechanism that allows the pieces to move with the head of the body
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    // head
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
};

const changeSnakePosition = () => {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
};

const drawApple = () => {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
};

const checkAppleCollision = () => {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        gulpSound.play();
    }
};

// keyboard
const keyDown = (event) => {
    // up / 87 is w
    if (event.keyCode === 38 || event.keyCode == 87) {
        // -1 --> y decrease
        yVelocity = -1;
        // stop moving on the x
        xVelocity = 0;
    }

    // down / 83 is s
    if (event.keyCode === 40 || event.keyCode == 83) {
        // 1 --> y increase
        yVelocity = 1;
        xVelocity = 0;
    }

    // left / 65 is a
    if (event.keyCode === 37 || event.keyCode == 65) {
        yVelocity = 0;
        xVelocity = -1;
    }

    // right / 68 is d
    if (event.keyCode === 39 || event.keyCode == 68) {
        yVelocity = 0;
        xVelocity = 1;
    }
};

document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('reload', gameStartSound.play());
document.body.addEventListener('keyup', (e) => {
    if (e.keyCode == 32 || e.code == "Space") {
        location.reload();
    }
});

drawGame();