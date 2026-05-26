
// INITIALIZATION & SETUP

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // The brush we use to draw on the canvas

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


// NEW HELPER: Move coin to a random position safely away from the player
function resetCoin() {
    let randomX, randomY;
    let distanceToPlayer;

    do {
        // Generate random coordinates inside the canvas boundaries
        randomX = Math.random() * (canvas.width - coin.size);
        randomY = Math.random() * (canvas.height - coin.size);
        
        // Calculate the straight-line distance between the coin and the player
        distanceToPlayer = Math.hypot(randomX - player.x, randomY - player.y);

    } while (distanceToPlayer < 100); // If too close (less than 100px), recalculate!

    // Assign the safe coordinates to the coin
    coin.x = randomX;
    coin.y = randomY;
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
        resetCoin(); // Relocate the coin safely
    }
}

// Render graphics (Clearing and drawing visual frames)
function draw() {
    // Clear the previous frame completely so the player doesn't leave a "trail"
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(coin.x, coin.y, coin.size, coin.size);

    // Set our brush color to neon light blue
    ctx.fillStyle = "#00E5FF";  
    ctx.fillRect(player.x, player.y, player.size, player.size); // Draw the player box: fillRect(x, y, width, height)
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