let knownCards = new Set();
let previousBetValue = 1;
let playerNumber;

function calculateCardsPerPlayer(){
  playerNumber = document.getElementById('player').value
  cardsPerPlayer = parseInt(52/ playerNumber)
}

let cardsPerPlayer = calculateCardsPerPlayer()

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
  const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ name: value, suit, photo: `<img src="deck-of-cards/${value}_of_${suit}.png">` });
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
  players.forEach(player => {
    for(let i = 0; i <= cardsPerPlayer; i++){
    player.cards.push(cards.shift());
    }
  });
  document.getElementById('selector').innerHTML = '';
}

function createDivs(){
  const allPlayers = players.slice(0,playerNumber);
  allPlayers.forEach((player, index) =>{
    let playerDiv = document.createElement('div');
    playerDiv.id = String(index + 1);
    playerDiv.classList.add(player.className);
    document.body.appendChild(playerDiv);
    playerDiv.innerHTML = '<img src="card-facedown.jpg"><br>'
    if(playerDiv.id == '1') playerDiv.innerHTML += '<button class="flip-button" onclick="flipCard();">Flip Card</button>';
  });
}

function flipCard(){ //incomplete
  const activePlayers = players.slice(0,playerNumber);
  const cardValues = activePlayers.map(p => getCardValue(p));
  const maxCard = Math.max(...cardValues);
  const winners = cardValues.filter(value => value == maxCard);
  if(winners.length > 1){
    
  }
}

function getCardValue(player){
  const card = player.cards[0]
  if(card.name === 'ace') return 14;
  else if(card.name === 'king') return 13;
  else if(card.name === 'queen') return 12;
  else if(card.name === 'jack') return 11;
  else return parseInt(card.name);
}
