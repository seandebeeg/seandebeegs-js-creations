let gameSpaces = Array.from({ length: 9 }, (_, i) => ({
  spaceId: document.getElementById(String(i)),
  status: document.getElementById(String(i)).innerHTML
}));

let record = JSON.parse(localStorage.getItem('ttt-record')) || 
  {playerWins: 0,
  playerTwo: 0,
  computerWins: 0,
  ties: 0};
let possibleResults = [
  [0,1,2],[3,4,5],[6,7,8], // horizontal
  [0,3,6],[1,4,7],[2,5,8], // vertical
  [0,4,8],[2,4,6]] // diagonal
; 

let gameLock = false;
let twoPlayer = false;
let playerOneTurn = true;

function playerMove(moveId) {
  if (moveId.status !== ' ') {
    alert('The move you have chosen is invalid');
    return;
  }

  if (twoPlayer) {
    if (playerOneTurn) {
      moveId.spaceId.innerHTML = 'X';
      moveId.status = 'X';
      playerOneTurn = false;
    } else {
      moveId.spaceId.innerHTML = 'O';
      moveId.status = 'O';
      playerOneTurn = true;
    }
  } else {
    moveId.spaceId.innerHTML = 'X';
    moveId.status = 'X';
  }
}

function cpuMove(isPlayerMoveRandom) {
  let botLog = [];
  let botMove;
  do {
    botMove = Math.floor(Math.random() * gameSpaces.length);
    botLog.push(botMove);
    if (botLog.length >= 250) return;
  } while (gameSpaces[botMove].status !== ' ');

  if (isPlayerMoveRandom === false) {
    gameSpaces[botMove].status = 'O';
    gameSpaces[botMove].spaceId.innerHTML = 'O';
  } else if (isPlayerMoveRandom === true) {
    gameSpaces[botMove].status = 'X';
    gameSpaces[botMove].spaceId.innerHTML = 'X';
  } else if (isPlayerMoveRandom === null) {
    alert('There has been an error, please refresh to restart the game');
  }
}

function checkForResult() {
  let allStatus = gameSpaces.map(space => space.status);
  let hasWinner = false;

  for (let combination of possibleResults) {
    const [a, b, c] = combination;
    if (allStatus[a] && allStatus[a] === allStatus[b] && allStatus[a] === allStatus[c]) {
      hasWinner = true;
      if (allStatus[a] === 'X') {
        record.playerWins++;
        document.querySelector('.result').textContent = `You win`;
        gameLock = true;
      } else if (allStatus[a] === 'O') {
        if (twoPlayer === true) {
          record.playerTwo++;
          document.querySelector('.result').textContent = `Player Two wins`;
          gameLock = true;
        } else {
          record.computerWins++;
          document.querySelector('.result').textContent = `You lose`;
          gameLock = true;
        }
      }
      document.querySelector('.record').textContent = `Player: ${record.playerWins} Player Two: ${record.playerTwo} Computer: ${record.computerWins} Ties: ${record.ties}`;
      localStorage.setItem('ttt-record', JSON.stringify(record));
      return;
    }
  }
  if (!hasWinner && allStatus.every(status => status !== ' ')) {
    record.ties++;
    document.querySelector('.result').textContent = 'Tie';
    document.querySelector('.record').textContent = `Player: ${record.playerWins} Player Two: ${record.playerTwo} Computer: ${record.computerWins} Ties: ${record.ties}`;
    localStorage.setItem('ttt-record', JSON.stringify(record));
    gameLock = true;
  }
}

function toggleTwoPlayer(){
  if(twoPlayer === false){
    twoPlayer = true;
  } else if(twoPlayer === true){
    twoPlayer = false;
  }
}

function clearBoard(){
  gameSpaces.forEach(space => {
    space.status = ' ';
    space.spaceId.innerHTML = ' ';
  })
  document.querySelector('.result').textContent = ' ';
  gameLock = false;
}

document.addEventListener("click", event => {
  const validIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'random'];
  const clickedButton = event.target.id;

  if (!validIds.includes(clickedButton)) return;

  if (twoPlayer && !gameLock && clickedButton !== 'random') {
    playerMove(gameSpaces[parseInt(clickedButton)]);
    checkForResult();
    return;
  }

  if (clickedButton === 'random' && !gameLock) {
    cpuMove(true);
    checkForResult();
    if (gameLock) return;
    setTimeout(cpuMove, 250, false);
    setTimeout(checkForResult, 251);
    return;
  }

  if (!gameLock && clickedButton !== 'random') {
    playerMove(gameSpaces[parseInt(clickedButton)]);
    checkForResult();
    if (gameLock) return;
    setTimeout(cpuMove, 250, false);
    setTimeout(checkForResult, 251);
    return;
  }

  if (gameLock && clickedButton !== 'reset') {
    alert('The game has ended');
  }
});