let computerMove;
let autoPlaying = false;
let record = JSON.parse(localStorage.getItem('record')) || { wins: 0, losses: 0, ties: 0, score: 0 };
let intervalId;

function pickComputerMove() {
  const rand = Math.random();
  if (rand < 1 / 3) {
    computerMove = 'rock';
  } else if (rand < 2 / 3) {
    computerMove = 'paper';
  } else {
    computerMove = 'scissors';
  }
}

function pickAutoMove() {
  const rand = Math.random();
  if (rand < 1 / 3) {
    return 'rock';
  } else if (rand < 2 / 3) {
    return 'paper';
  } else {
    return 'scissors';
  }
}

function playerMove(move) {
  let result;
  if (move === 'scissors' && computerMove === 'rock') {
    record.losses++;
    result = 'lose';
  } else if (move === 'rock' && computerMove === 'rock') {
    record.ties++;
    result = 'tied';
  } else if (move === 'paper' && computerMove === 'rock') {
    record.wins++;
    result = 'win';
  } else if (move === 'rock' && computerMove === 'paper') {
    record.losses++;
    result = 'lose';
  } else if (move === 'paper' && computerMove === 'paper') {
    record.ties++;
    result = 'tied';
  } else if (move === 'scissors' && computerMove === 'paper') {
    record.wins++;
    result = 'win';
  } else if (move === 'rock' && computerMove === 'scissors') {
    record.wins++;
    result = 'win';
  } else if (move === 'paper' && computerMove === 'scissors') {
    record.losses++;
    result = 'lose';
  } else if (move === 'scissors' && computerMove === 'scissors') {
    record.ties++;
    result = 'tied';
  }

  // Update result display and tab title
  const resultDiv = document.getElementById('result');
  const title = document.getElementById('tabName');
  if (result === 'lose') {
    resultDiv.style.color = '#ff0000';
    title.innerHTML = 'Loss';
  } else if (result === 'win') {
    resultDiv.style.color = '#00ff00';
    title.innerHTML = 'Win';
  } else if (result === 'tied') {
    resultDiv.style.color = '#ffffff';
    title.innerHTML = 'Tie';
  }

  record.score = record.wins - record.losses;
  resultDiv.innerHTML =
    `<p>You chose ${move} the computer picked ${computerMove}, you ${result}</p>
     <p>Wins: ${record.wins} Losses: ${record.losses} Ties: ${record.ties}</p>
     <p>Score: ${record.score} is calculated by subtracting losses from wins</p>`;
  localStorage.setItem('record', JSON.stringify(record));
}

function autoPlay() {
  const btn = document.getElementById('autoplay');
  if (!autoPlaying) {
    intervalId = setInterval(() => {
      pickComputerMove();
      playerMove(pickAutoMove());
      autoPlaying = true;
    }, 1000);
    btn.innerHTML = 'Stop Auto Play';
  } else {
    clearInterval(intervalId);
    autoPlaying = false;
    btn.innerHTML = 'Auto Play';
  }
}