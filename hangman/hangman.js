let pickedCategory = '';
let pickedWord = '';
let guessedLetters = [];
let lives = 5;
let hiddenWord = [];
let gameLock = false;
let record = JSON.parse(localStorage.getItem('hangmanRecord')) || { win: 0, lose: 0 };

const categories = [
  'Kitchen Appliance',
  'Electronics',
  'House Items',
  'Business Items',
  'Musical Instruments'
];

const words = {
  'Kitchen Appliance': ['Dishwasher', 'Sink', 'Oven', 'Stove'],
  'Electronics': ['Cellphone', 'Computer', 'Game console', 'Speaker', 'Television', 'Mouse', 'Keyboard'],
  'House Items': ['Bed', 'Toilet', 'Shower', 'Shelf', 'Counter'],
  'Business Items': ['Cubicle', 'Meeting Room', 'Office Phone', 'Desk', 'Chair'],
  'Musical Instruments': ['Trumpet', 'Violin', 'Piano', 'French Horn', 'Tuba', 'Viola', 'Xylophone']
};

function pickCategory() {
  pickedCategory = categories[Math.floor(Math.random() * categories.length)];
  document.querySelector('.catagory').textContent = pickedCategory;
}

function pickWord() {
  const wordList = words[pickedCategory] || [];
  pickedWord = wordList[Math.floor(Math.random() * wordList.length)] || '';
  pickedWord = pickedWord.replaceAll(' ', ''); // Remove spaces
  hiddenWord = Array(pickedWord.length).fill('_');
  guessedLetters = [];
  lives = 5;
  gameLock = false;
  updateDisplay();
}

function updateDisplay() {
  document.querySelector('.characters').textContent = `Letters: ${pickedWord.length}`;
  document.querySelector('.word').textContent = hiddenWord.join(' ');
  document.querySelector('.trash').textContent = guessedLetters.join(', ');
  document.querySelector('.record').textContent = `Wins: ${record.win} Losses: ${record.lose}`;
}

function replay() {
  pickCategory();
  pickWord();
  document.querySelector('.result').innerHTML = '';
}

document.addEventListener('keydown', function (event) {
  if (gameLock) {
    document.querySelector('.result').innerHTML =
      `Please press the replay button to play again.<br> <button class="replay-btn" onclick="replay()">Replay</button>`;
    return;
  }

  if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
    const guess = event.key.toLowerCase();

    if (guessedLetters.includes(guess) || hiddenWord.includes(guess)) return;

    let correct = false;
    for (let i = 0; i < pickedWord.length; i++) {
      if (pickedWord[i].toLowerCase() === guess) {
        hiddenWord[i] = pickedWord[i];
        correct = true;
      }
    }

    if (correct) {
      if (hiddenWord.join('').toLowerCase() === pickedWord.toLowerCase()) {
        gameLock = true;
        record.win++;
        localStorage.setItem('hangmanRecord', JSON.stringify(record));
        document.querySelector('.result').innerHTML =
          'You won! <br> <button class="replay-btn" onclick="replay();">Replay</button>';
      }
    } else {
      lives--;
      guessedLetters.push(guess);
      if (lives === 0) {
        gameLock = true;
        record.lose++;
        localStorage.setItem('hangmanRecord', JSON.stringify(record));
        document.querySelector('.result').innerHTML =
          `You lost! The word was ${pickedWord}. <br> <button class="replay-btn" onclick="replay()">Replay</button>`;
      }
    }
    updateDisplay();
  }
});

pickCategory();