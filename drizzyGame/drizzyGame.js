const drizzy = document.getElementById('drizzy');
const gameArea = document.getElementById('gameArea');
let x = 275;
let y = 175;
const speed = 10;

function moveDrizzy(dx, dy) {
    x += dx;
    y += dy;
    // Keep Drizzy inside the game area
    x = Math.max(0, Math.min(x, 600 - 50));
    y = Math.max(0, Math.min(y, 400 - 50));
    drizzy.style.left = x + 'px';
    drizzy.style.top = y + 'px';
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            moveDrizzy(0, -speed);
            break;
        case 'ArrowDown':
            moveDrizzy(0, speed);
            break;
        case 'ArrowLeft':
            moveDrizzy(-speed, 0);
            break;
        case 'ArrowRight':
            moveDrizzy(speed, 0);
            break;
    }
});

drizzys = ['🧑‍🎤','🕺','😎','👟'];
drizzy.textContent = drizzys[1]; // Use a zesty emoji for now