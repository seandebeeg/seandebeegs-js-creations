let gameSpaces = 
  [
    {spaceId:document.getElementById("0"), status: document.getElementById('0').innerHTML},
    {spaceId:document.getElementById('1'), status: document.getElementById('1').innerHTML},
    {spaceId:document.getElementById('2'), status: document.getElementById('2').innerHTML},
    {spaceId:document.getElementById('3'), status: document.getElementById('3').innerHTML},
    {spaceId:document.getElementById('4'), status: document.getElementById('4').innerHTML},
    {spaceId:document.getElementById('5'), status: document.getElementById('5').innerHTML},
    {spaceId:document.getElementById('6'), status: document.getElementById('6').innerHTML},
    {spaceId:document.getElementById('7'), status: document.getElementById('7').innerHTML},
    {spaceId:document.getElementById('8'), status: document.getElementById('8').innerHTML}
  ];
  let record = JSON.parse(localStorage.getItem('ttt-record')) || {playerWins: 0, playerTwo: 0, computerWins: 0, ties: 0};
  console.log(record)
  let possibleResults = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let gameLock = false;
  let twoPlayer = false;
  let playerOneTurn = true;
function playerMove(moveId){
  if(twoPlayer === true && playerOneTurn === true){
    if(moveId.status === ' '){
      moveId.spaceId.innerHTML = 'X'
      moveId.status = 'X'
      playerOneTurn = false;
    } else if (moveId.status !== ' '){
      alert('the move you have chosen is invalid')
    }
    return;
  } else if(twoPlayer === true && playerOneTurn === false){
    if(moveId.status === ' '){
      moveId.spaceId.innerHTML = 'O'
      moveId.status = 'O'
      playerOneTurn = true;
    } else if (moveId.status !== ' '){
      alert('the move you have chosen is invalid')
    }
    return;
  } else if(twoPlayer === false){
    if(moveId.status === ' '){
      moveId.spaceId.innerHTML = 'X'
      moveId.status = 'X'
    } else if (moveId.status !== ' '){
      alert('the move you have chosen is invalid')
    }
  }
 }
function cpuMove(isPlayerMoveRandom){
  let botMove = Math.floor(Math.random() * gameSpaces.length)
  let botLog = []
  if(isPlayerMoveRandom === false){
 while(gameSpaces[botMove].status !== ' '){
  botMove = Math.floor(Math.random() * gameSpaces.length);
  botLog.push(botMove)
  if(botLog.length >= 250){
    return;
  }
 }
 gameSpaces[botMove].status = 'O'
 gameSpaces[botMove].spaceId.innerHTML = 'O'
 }
 if(isPlayerMoveRandom === true){
  while(gameSpaces[botMove].status !== ' '){
   botMove = Math.floor(Math.random() * gameSpaces.length);
   botLog.push(botMove)
   if(botLog.length >= 250){
     return;
   }
  }
  gameSpaces[botMove].status = 'X'
  gameSpaces[botMove].spaceId.innerHTML = 'X'
  }
  if(isPlayerMoveRandom === null){
    alert('There has been an error please refresh to restart the game');
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
document.addEventListener("click", event =>{
  if(event.target.id === "0"|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'random'){
    const clickedButton = event.target.id;
    if(twoPlayer === true && gameLock === false){
      playerMove(gameSpaces[parseInt(clickedButton)])
      checkForResult(); if(gameLock === true){return;}
      return;
    }
    else if(clickedButton ==='random' && gameLock === false){
      cpuMove(true) 
      checkForResult(); if(gameLock === true){return;}
      setTimeout(cpuMove, 250, false)
      setTimeout(checkForResult,251)
    }
    else if(clickedButton !== 'random' && gameLock === false){
      playerMove(gameSpaces[parseInt(clickedButton)])
      checkForResult(); if(gameLock === true){return;}
      setTimeout(cpuMove, 250, false)
      setTimeout(checkForResult, 251)
   }else if(gameLock === true && clickedButton !== 'reset'){
     alert('The game has ended')
   }
  }
}) 