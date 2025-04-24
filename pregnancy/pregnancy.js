document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');

    // Initialize game state
    let currentWeek = 1;
    const maxWeeks = 40;

    // Create elements for the game
    const weekDisplay = document.createElement('p');
    weekDisplay.id = 'week-display';
    weekDisplay.textContent = `Week: ${currentWeek}`;
    gameContainer.appendChild(weekDisplay);

    const character = document.createElement('div');
    character.id = 'character';
    character.style.width = '100px';
    character.style.height = '100px';
    character.style.backgroundColor = 'pink';
    character.style.borderRadius = '50%';
    character.style.position = 'relative';
    character.style.margin = '20px auto';
    character.style.animation = 'jiggle 0.5s infinite';
    gameContainer.appendChild(character);

    // Add mouse-triggered jiggle effect
    character.addEventListener('mouseover', () => {
        character.style.animation = 'jiggle 0.5s';
    });

    character.addEventListener('animationend', () => {
        character.style.animation = ''; // Reset animation to allow re-triggering
    });

    // Add a button to progress the game
    const progressButton = document.createElement('button');
    progressButton.textContent = 'Next Week';
    progressButton.addEventListener('click', () => {
        if (currentWeek < maxWeeks) {
            currentWeek++;
            weekDisplay.textContent = `Week: ${currentWeek}`;
            character.style.transform = `scale(${1 + currentWeek / 100})`; // Simulate growth
        } else {
            alert('Congratulations! You have reached the end of the pregnancy.');
        }
    });
    gameContainer.appendChild(progressButton);

    // Add jiggle physics using CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes jiggle {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
    `;
    document.head.appendChild(style);
});