
// INITIALIZATION & SETUP

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // The brush we use to draw on the canvas

const scoreVal = document.getElementById("scoreVal");
let score = 0;

// Define our player object properties
const player = {
    x: 300,        // Start right in the middle horizontally (600 / 2)
    y: 200,        // Start right in the middle vertically (400 / 2)
    size: 20,      // Width and height of the square in pixels
    speed: 2,      // How many pixels the player moves per frame
    dx: 0,         // Current horizontal velocity (delta X)
    dy: 0          // Current vertical velocity (delta Y)
};

const coin = {
    x: 0,       // Will be assigned dynamically
    y: 0,       // Will be assigned dynamically
    size: 15    // Slightly smaller than the player
};

const enemies = [];
const enemySize = 12;

let gameOver = false;

// Object to keep track of which keys are currently pressed down
const keys = {};

// INPUT LISSENERS (EVENT TRACKING)

// When a key is pressed, set its status to true
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

// When a key is released, set its status to false
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});


// FIXED HELPER: Move coin to a random position safely away from the player AND all enemies
function resetCoin() {
    let randomX, randomY;
    let overlapping = true;
    
    // Create a temporary object matching the size of the coin to test boundaries
    let potentialCoin = { x: 0, y: 0, size: coin.size };

    // Loop until we find a location that is completely clear
    while (overlapping) {
        randomX = Math.random() * (canvas.width - coin.size);
        randomY = Math.random() * (canvas.height - coin.size);
        
        potentialCoin.x = randomX;
        potentialCoin.y = randomY;

        // 1. Check distance to Player (Keep it at least 100px away so it's fair)
        const distanceToPlayer = Math.hypot(randomX - player.x, randomY - player.y);
        const tooCloseToPlayer = distanceToPlayer < 100;

        // 2. Check collision with all existing Red Pixel enemies
        let hitAnEnemy = false;
        for (let i = 0; i < enemies.length; i++) {
            let existingEnemy = { x: enemies[i].x, y: enemies[i].y, size: enemySize };
            if (isColliding(potentialCoin, existingEnemy)) {
                hitAnEnemy = true;
                break; // Stop checking enemies early if we find an overlap
            }
        }

        // If it's far enough from the player AND doesn't hit any enemy, we are safe!
        if (!tooCloseToPlayer && !hitAnEnemy) {
            overlapping = false;
        }
    }

    // Assign the verified safe coordinates to the coin
    coin.x = randomX;
    coin.y = randomY;
}

// NEW HELPER: Spawn a new random enemy safely without overlapping existing entities
function spawnEnemy() {
    let randomX, randomY;
    let overlapping = true;
    
    // Create a temporary object matching the size of a potential enemy
    let potentialEnemy = { x: 0, y: 0, size: enemySize };

    // Loop until we find a perfectly clear location
    while (overlapping) {
        randomX = Math.random() * (canvas.width - enemySize);
        randomY = Math.random() * (canvas.height - enemySize);
        
        potentialEnemy.x = randomX;
        potentialEnemy.y = randomY;

        // 1. Check collision with Player
        const hitPlayer = isColliding(potentialEnemy, player);
        
        // 2. Check collision with Coin
        const hitCoin = isColliding(potentialEnemy, coin);

        // 3. Check collision with all other existing Red Pixels
        let hitAnotherEnemy = false;
        for (let i = 0; i < enemies.length; i++) {
            let existingEnemy = { x: enemies[i].x, y: enemies[i].y, size: enemySize };
            if (isColliding(potentialEnemy, existingEnemy)) {
                hitAnotherEnemy = true;
                break; // Stop looping through enemies early if we find an overlap
            }
        }

        // If it passes all 3 checks, it is NOT overlapping and we can exit the while-loop
        if (!hitPlayer && !hitCoin && !hitAnotherEnemy) {
            overlapping = false;
        }
    }

    // Push the clean, safe coordinates into our global enemies tracker
    enemies.push({ x: randomX, y: randomY });
}


// NEW HELPER: Axis-Aligned Bounding Box (AABB) Collision Check
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.size &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.size &&
           rect1.y + rect1.size > rect2.y;
}


// CORE GAME LOOP ENGINE


// Update calculations (Positions, movement, math)
function update() {
    if (gameOver) return; // Stop executing movement if game is over
    // Reset velocity every frame so the player stops moving when keys are released
    player.dx = 0;
    player.dy = 0;

    // Check vertical keys (Remember: Up is negative Y, Down is positive Y)
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) player.dy = -player.speed;
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) player.dy = player.speed;

    // Check horizontal keys
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) player.dx = -player.speed;
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) player.dx = player.speed;

    // Update the player's position based on calculated velocity
    player.x += player.dx;
    player.y += player.dy;

    // [BOUNDARY CHECKING] Keep the player inside the canvas box walls
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

    if (isColliding(player, coin)) {
        score += 10;
        scoreVal.innerText = score;

        resetCoin(); // Relocate the coin safely
        spawnEnemy();
    }

    for (let i = 0; i < enemies.length; i++) {
        let currentEnemy = { x: enemies[i].x, y: enemies[i].y, size: enemySize };
        if (isColliding(player, currentEnemy)) {
            gameOver = true; // Set state to true
        }
    }
}

// Render graphics (Clearing and drawing visual frames)
function draw() {
    // Clear the previous frame completely so the player doesn't leave a "trail"
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(coin.x, coin.y, coin.size, coin.size);

    ctx.fillStyle = "#FF3333";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
    });

    // Set our brush color to neon light blue
    ctx.fillStyle = "#00E5FF";  
    ctx.fillRect(player.x, player.y, player.size, player.size); // Draw the player box: fillRect(x, y, width, height)

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FF3333";
        ctx.font = "bold 36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px sans-serif";
        ctx.fillText("Refresh the page to try again", canvas.width / 2, canvas.height / 2 + 30);
    }
}

// The heartbeat loop of the game
function gameLoop() {
    update(); // 1. Do the math calculations
    draw();   // 2. Render the graphics on screen
    
    // Tell the browser to run this loop again as fast as possible (60fps)
    requestAnimationFrame(gameLoop);
}

// Start the engine!
resetCoin();
gameLoop();