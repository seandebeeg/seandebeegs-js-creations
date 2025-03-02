let computerMove;
let autoPlaying = false;

function pickComputerMove(){
 computerMove = Math.random();
 if(computerMove <= 1/3 && computerMove >= 0){
  computerMove = 'rock'
 } else if(computerMove >= 1/3 && computerMove <= 2/3){
  computerMove = 'paper'
 } else if(computerMove >= 2/3 && computerMove <= 1){
  computerMove = 'scissors'
 }
}
function pickAutoMove(){
  let autoMove = Math.random();
  if(autoMove <= 1/3 && autoMove >= 0){
   autoMove = 'rock'
  } else if(autoMove >= 1/3 && autoMove <= 2/3){
   autoMove = 'paper'
  } else if(autoMove >= 2/3 && autoMove <= 1){
   autoMove = 'scissors'
  }
  return autoMove;
 }
function playerMove(move){
  let result;
  if(move === 'scissors'&& computerMove === 'rock'){
    record.losses++
    result = 'lose'
  } else if(move === 'rock'&& computerMove === 'rock'){
    record.ties++
    result= 'tied'
  } else if(move === 'paper'&& computerMove === 'rock'){
    record.wins++
    result = 'win'
  } else if(move === 'rock'&& computerMove === 'paper'){
    record.losses++
    result = 'lose'
  } else if(move === 'paper'&& computerMove === 'paper'){
    record.ties++
    result ='tied'
  } else if(move === 'scissors'&& computerMove === 'paper'){
    record.wins++
    result = 'win'
  } else if(move === 'rock'&& computerMove === 'scissors'){
    record.wins++
    result='win'
  } else if(move === 'paper'&& computerMove === 'scissors'){
    record.losses++
    result = 'lose'
  } else if(move === 'scissors'&& computerMove === 'scissors'){
    record.ties++
    result ='tied'
  }
  if(result === 'lose'){
    const resultTextLose = document.getElementById('result')
    resultTextLose.style.color = '#ff0000'
    const title = document.getElementById('tabName')
    title.innerHTML = 'Loss'
  }else if(result === 'win'){
    const resultTextWin = document.getElementById('result')
    resultTextWin.style.color = '#00ff00'
    const title = document.getElementById('tabName')
    title.innerHTML = 'Win'
  }else if (result === 'tied'){
    const resultTextTie = document.getElementById('result')
    resultTextTie.style.color = '#ffffff'
    const title = document.getElementById('tabName')
    title.innerHTML = 'Tie'
  }
  const resultDiv = document.getElementById('result')
  record.score = record.wins - record.losses;
  resultDiv.innerHTML =`<p>You chose ${move} the computer picked ${computerMove}, you ${result}</p><p>Wins:${record.wins} Losses: ${record.losses} Ties: ${record.ties}</p><p>Score: ${record.score} is calculated by subtracting losses from wins</p>`
  localStorage.setItem('record', JSON.stringify(record))
}
let record = JSON.parse(localStorage.getItem('record')) || {wins:0, losses:0, ties: 0,score:0}
let intervalId;
function autoPlay(){
  if(!autoPlaying){
 intervalId = setInterval(function(){
  pickComputerMove()
  playerMove(pickAutoMove())
  autoPlaying = true
 }, 1000)
 document.getElementById('autoplay').innerHTML = `Stop Auto Play`
}
else{
  clearInterval(intervalId)
  autoPlaying = false;
  document.getElementById('autoplay').innerHTML = `Auto Play`
}
}