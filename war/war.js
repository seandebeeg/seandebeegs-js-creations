let names =['2','3','4','5','6','7','8','9','10','jack','queen','king','ace']
let values = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14];
let suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
let knownCards = new Set();
let players = 2;
let cardsPerPlayer;
let playerOneCards = [];
let playerTwoCards = [];
let playerThreeCards = [];
let playerFourCards = [];
let playerFiveCards = [];
let record = JSON.parse(localStorage.getItem('war-record'))||{one:0, two:0,three:0,four:0,five:0}

function calculateCardsPerPlayer() {
  let selectionElement = document.getElementById('player');
  players = selectionElement.value;
  cardsPerPlayer = Math.floor(52 / players);
}

function dealCards() {
  let cards = [];
  while (cards.length < 52) {
    let valueGenerator = Math.floor(Math.random() * values.length);
    let suitGenerator = Math.floor(Math.random() * suits.length);
    let cardPicture = `<img src="deck-of-cards/${names[valueGenerator]}_of_${suits[suitGenerator]}.png" class="player-cards">`
    
    let card = { name: names[valueGenerator], suit: suits[suitGenerator],value: values[valueGenerator],photo:cardPicture};
    let cardString = `${card.name} of ${card.suit}`;

    if (!knownCards.has(cardString)) {
      knownCards.add(cardString);
      cards.push(card);
    }
  }

  for (let i = 0; i < cardsPerPlayer; i++) {
    playerOneCards.push(cards[i]);
    playerTwoCards.push(cards[i + cardsPerPlayer]);
    if (players > 2) playerThreeCards.push(cards[i + 2 * cardsPerPlayer]);
    if (players > 3) playerFourCards.push(cards[i + 3 * cardsPerPlayer]);
    if (players > 4) playerFiveCards.push(cards[i + 4 * cardsPerPlayer]);
  }
   document.getElementById('selector').innerHTML =``;
   document.getElementById('player').innerHTML = `<img src="card-facedown.jpg"><br>
   <button class="flip-button" onclick="flipCard(); checkForResults">Flip a Card</button>`
}

function flipCard() {
  let playerCards = [playerOneCards, playerTwoCards, playerThreeCards, playerFourCards, playerFiveCards].slice(0, players);
  let currentCards = playerCards.map(cards => cards[0]);

  let maxCardValue = Math.max(...currentCards.map(card => Number(card.value)));
  let winners = currentCards.filter(card => Number(card.value) === maxCardValue);

  if (winners.length === 1) {
    let winnerIndex = currentCards.findIndex(card => Number(card.value) === maxCardValue);
    let winnerCards = playerCards[winnerIndex];
    currentCards.forEach(card => winnerCards.push(card));
    playerCards.forEach(cards => cards.shift());
    document.querySelector('.result').innerHTML = `Player ${winnerIndex +1} got the cards`
  } else {
    war = true;
    if (playerCards.some(cards => cards.length < 5)) {
      document.querySelector('.result').innerHTML = `Player ${winnerIndex +1} cannot do war and therfore is out`
    }

    let warCards = playerCards.map(cards => cards[4]);
    let warMaxCardValue = Math.max(...warCards.map(card => Number(card.value)));
    let warWinners = warCards.filter(card => Number(card.value) === warMaxCardValue);

    if (warWinners.length === 1) {
      let warWinnerIndex = warCards.findIndex(card => Number(card.value) === warMaxCardValue);
      let warWinnerCards = playerCards[warWinnerIndex];
      playerCards.forEach(cards => {
        warWinnerCards.push(...cards.splice(0, 5));
      });
    } else {
      playerCards.forEach((cards, index) => {
        cards.unshift(currentCards[index], ...cards.splice(0, 4));
      });
      flipCard();
    }
  }
}

function checkForResults() {
  let allPlayerCards = [playerOneCards, playerTwoCards, playerThreeCards, playerFourCards, playerFiveCards]
  for(let i=0; i <=4; i++){
    if(allPlayerCards[i].length === 0){
      players--
      document.querySelector('.result').innerHTML =`Player ${i+1} is out, there are ${players} remaining`
      return;
    }
    if(allPlayerCards[i].length === 52){
      document.querySelector('.result').innerHTML = `Player ${i+1} Wins`
      return;
    }
  }
}