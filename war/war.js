let playerNumber = 2;
let cardsPerPlayer;

function calculateCardsPerPlayer(){
  playerNumber = document.getElementById('player').value;
  cardsPerPlayer = Math.floor(52 / playerNumber);
}

cardsPerPlayer = calculateCardsPerPlayer();

function createPlayer(className){
  return {
    cards: [],
    className: className
  };
}

let players = [
  createPlayer('player1'),
  createPlayer('player2'),
  createPlayer('player3'),
  createPlayer('player4'),
  createPlayer('player5')
];

function buildDeck() {
  const values = [
    'ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'
  ];
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({
        name: value,
        suit,
        photo: `<img src="deck-of-cards/${value}_of_${suit}.png">`
      });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

let cards = buildDeck();
shuffle(cards);

function dealCards(){
  players.forEach((player,index) => {
    if(index + 1 > playerNumber) return;
    for(let i = 0; i < cardsPerPlayer; i++){
      player.cards.push(cards.shift());
    }
  });
  document.getElementById('selector').innerHTML = '';
}

function createDivs(){
  const allPlayers = players.slice(0, playerNumber);
  allPlayers.forEach((player, index) =>{
    let playerDiv = document.createElement('div');
    playerDiv.id = String(index + 1);
    playerDiv.classList.add(player.className);
    document.body.appendChild(playerDiv);
    playerDiv.innerHTML = '<img src="card-facedown.jpg"><br>';
    if (playerDiv.id == '1') {
      playerDiv.innerHTML += '<button class="flip-button" onclick="flipCard();">Flip Card</button>';
    }
  });
}

function flipCard(existingWarPile = []){
  const activePlayers = players.slice(0, playerNumber);
  let pile = [];
  activePlayers.forEach(p => {
    if(p.cards.length <= 0){
      pile.push({name:'-1'});
    } else{
      pile.push(p.cards.shift());
    }
  });
  const cardValues = pile.map(card => getCardValue(card));
  const maxCard = Math.max(...cardValues);
  let winners = activePlayers
    .map((p, idx) => ({ value: cardValues[idx], index: idx }))
    .filter(card => card.value === maxCard);
  if (winners.length > 1){ //war management
    let warCards = [];
    let warPile = existingWarPile || [];
    warPile.push(...pile);
    winners.forEach(w => {
      const player = players[w.index];
      if (player.cards.length >= 4){
        let warCardSet = [];
        for(let i = 0; i < 4; i++) {
          let card = player.cards.shift();
          warCardSet.push(card);
        }
        let warCardValue = getCardValue(warCardSet[warCardSet.length - 1]);
        warPile.push(...warCardSet);
        warCards.push({ value: warCardValue, index: w.index });
      } else {
        warCards.push({ value: -1, index: w.index });
        while(player.cards.length > 0){
          warPile.push(player.cards.shift());
        }
        document.querySelector('.result').innerHTML = `Player ${w.index + 1} has lost`;
      }
    });

    const warMaxCard = Math.max(...warCards.map(w => w.value));
    const warWinners = warCards.filter(w => w.value === warMaxCard);

    if (warWinners.length === 1){
      const winnerIdx = warWinners[0].index;
      warPile.forEach(card =>{
        if(card.value !== -1){
          players[winnerIdx].cards.push(card);
        }
      });
      document.querySelector('.result').innerHTML = `Player ${winnerIdx+1} has won the war`;
      setTimeout( function() { //shows war cards *INCOMPLETE*
        winners.forEach((w, index) =>{
          
        })
      },250);
    } else{ // recursive war
      flipCard(warPile);
    }
  } else{ //single winner
    const winnerIdx = winners[0].index;
    pile.forEach((card, index) => {
      if(index + 1 !== 1 && players[index].cards.length > 0){
        document.getElementById(`${index+1}`).innerHTML = card.photo;
      }else if(players[index].cards.length > 0 && index+1 == 1){
        document.getElementById('1').innerHTML =  `${card.photo}<br> 
          <button class="flip-button" onclick="flipCard()">Flip Card</button>
        `;
      }else if(players[index].cards.length === 0 && index + 1 === 1){
        document.getElementById('1').innerHTML ='<button class="flip-button" onclick="flipCard()">Flip Card</button> <button class="player-selection" onclick="playAgain();">Play Again</button>';
      }
    });
    pile.forEach(card =>{
      if(card.value !== -1){
        players[winnerIdx].cards.push(card);
      }
    });
    checkForLosers();
  }
}

function getCardValue(card = {}){
  if (card.name === 'ace') return 14;
  else if (card.name === 'king') return 13;
  else if (card.name === 'queen') return 12;
  else if (card.name === 'jack') return 11;
  else return parseInt(card.name);
}

function checkForLosers(){
  let loserArray = [];
  const activePlayers = players.slice(0, playerNumber)
  activePlayers.forEach((player, index) => {
    if(player.cards.length <= 0){
      document.querySelector('.result').innerHTML = `Player ${index+1} has lost`;
      loserArray.push(player);
    }
  })
  if(loserArray.length === playerNumber - 1){
    let winner = [];
    winner = players
      .slice(0,playerNumber)
      .map((p,idx) => ({length: p.cards.length, idx}))
      .filter(p => p.idx > 0 && p.idx == 52);
    document.querySelector('.result').innerHTML = `Player ${winner[0].idx + 1} has won the game <br><button class="player-selection" onclick="playAgain()"> Play Again</button>`;
  }
}

function restoreSelectionPage(){
  document.body.innerHTML = `
  <div class="selector" id="selector">
    <form>
      <p class="player-count">Pre Game: Player Count</p>
      <select id="player" class="player-selection">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button onclick="event.preventDefault(); calculateCardsPerPlayer(); dealCards(); createDivs();" type="submit" class="player-selection">Generate Game</button>
    </form>
  </div>
  <div class="result"></div>
  <script src="war.js"></script>
  `;
}

function playAgain(){
  players.forEach(p => {
    p.cards = [];
  });
  cards = [];
  restoreSelectionPage();
}
