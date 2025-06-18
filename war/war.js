let knownCards = new Set();
let previousBetValue = 1;
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
  activePlayers.forEach(p => pile.push(p.cards.shift()));
  const cardValues = activePlayers.map(p => getCardValue(p));
  const maxCard = Math.max(...cardValues);
  let winners = activePlayers
    .map((p, idx) => ({ value: cardValues[idx], index: idx }))
    .filter(card => card.value === maxCard);
  if (winners.length > 1){ //war management
    let warCards = [];
    let warPile = existingWarPile || [];
    pile.forEach(card => warPile.push(pile.shift()));
    winners.forEach(w => {
      const player = players[w.index];
      if (player.cards.length >= 4) {
        player.cards.forEach(card =>{
          for(let i = 0; i <= 3; i++){
            warPile.push(card);
            player.cards.splice(i);
          }
        });
        warCards.push({ value: getCardValue(player), index: w.index });
      } else{
        warCards.push({ value: -1, index: w.index });
        player.cards.forEach(card => warPile.push(player.cards.shift()));
        document.querySelector('.result').innerHTML = `Player has lost `
      }
    });

    const warMaxCard = Math.max(...warCards.map(w => w.value));
    const warWinners = warCards.filter(w => w.value === warMaxCard);

    if (warWinners.length === 1){
      const winnerIdx = warWinners[0].index;
      warPile.forEach(card => players[winnerIdx].cards.push(card));
      // I will update the html later
    } else{ // recursive war
      flipCard(warPile);
    }
  } else{ //single winner
    const winnerIdx = winners[0].index;
    pile.forEach((card, index) => {
      if(index+1 !== 1){
        document.getElementById(`${index+1}`).innerHTML = card.photo;
      } else{
        document.getElementById('1').innerHTML =  `${card.photo}<br> 
          <button class="flip-button" onclick="flipCard()">Flip Card</button>
        `;
      }
    });
    pile.forEach(card => players[winnerIdx].cards.push(pile.shift()));
    checkForLosers()
  }
}

function getCardValue(player = {}){
  const card = player.cards[0];
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
      document.querySelector('.result').innerHTML = `Player ${index+1} has lost`
      loserArray.push(player)
    }
  })
  if(loserArray.length === playerNumber - 1){
    let winner = [];
    winner = players
    .slice(0,playerNumber)
    .map((p,idx) => ({length: p.cards.length, idx}))
    .filter(number => number > 0 && number == 52);
  }
}