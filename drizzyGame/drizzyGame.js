const drizzy = document.getElementById('drizzy');
const gameArea = document.getElementById('gameArea');
let x = 275;
let y = 175;
const speed = 10;
let score = 0;

function moveDrizzy(dx, dy) {
    x += dx;
    y += dy;
    x = Math.max(0, Math.min(x, 600 - 50));
    y = Math.max(0, Math.min(y, 400 - 50));
    drizzy.style.left = x + 'px';
    drizzy.style.top = y + 'px';
    checkCollision();
}

function createLittleGirl() {
    const littleGirl = document.createElement('div');
    littleGirl.classList.add('little-girl');
    littleGirl.style.width = '30px';
    littleGirl.style.height = '30px';
    littleGirl.style.backgroundColor = 'pink';
    littleGirl.style.borderRadius = '50%';
    littleGirl.style.position = 'absolute';
    littleGirl.style.left = Math.random() * (600 - 30) + 'px';
    littleGirl.style.top = Math.random() * (400 - 30) + 'px';
    gameArea.appendChild(littleGirl);
}

function checkCollision() {
    const littleGirls = document.querySelectorAll('.little-girl');
    littleGirls.forEach(littleGirl => {
        const girlRect = littleGirl.getBoundingClientRect();
        const drizzyRect = drizzy.getBoundingClientRect();

        if (
            drizzyRect.left < girlRect.right &&
            drizzyRect.right > girlRect.left &&
            drizzyRect.top < girlRect.bottom &&
            drizzyRect.bottom > girlRect.top
        ) {
            gameArea.removeChild(littleGirl);
            score++;
            console.log(`Score: ${score}`);
            createLittleGirl(); // Spawn a new little girl
        }
    });
}

// Spawn initial little girls
for (let i = 0; i < 3; i++) {
    createLittleGirl();
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