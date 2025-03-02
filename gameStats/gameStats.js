let ticTacRecord = JSON.parse(localStorage.getItem('ttt-record')) || {playerWins: 0, playerTwo: 0, computerWins: 0, ties: 0};
let hangmanRecord = JSON.parse(localStorage.getItem('hangmanRecord')) || {win: 0, lose: 0 }
let rockPaperScissorsRecord = JSON.parse(localStorage.getItem('record')) || {wins:0, losses:0, ties: 0}

function deleteRecord(game){
 localStorage.removeItem(game)
}

document.querySelector('.hang-record').innerHTML = `Wins: ${hangmanRecord.win}  Losses: ${hangmanRecord.lose}`

document.querySelector('.tic-record').innerHTML = `Player One: ${ticTacRecord.playerWins}  Player Two: ${ticTacRecord.playerTwo}  Computer: ${ticTacRecord.computerWins}  Ties: ${ticTacRecord.ties}`

document.querySelector('.rps-record').innerHTML = `Wins: ${rockPaperScissorsRecord.wins}  Losses: ${rockPaperScissorsRecord.losses}  Ties: ${rockPaperScissorsRecord.ties}`