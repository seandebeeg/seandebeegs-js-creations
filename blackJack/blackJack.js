alert('No real money is involved in the playing of this game');
let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let knownCards = new Set();
let players = 2;
let cardsPerPlayer = 2;
let playerOne = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1};
let playerTwo = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1};
let playerThree = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1};
let playerFour = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1};
let playerFive = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1};
let startingBet = 1;
let cards = [];
let previousBetValue = 1;

function dealCards() {
  players = document.getElementById('playerCount').value;
  while (cards.length < 52) {
    let valueGenerator = Math.floor(Math.random() * values.length);
    let suitGenerator = Math.floor(Math.random() * suits.length);
    let cardPicture = `<img src="deck-of-cards/${values[valueGenerator]}_of_${suits[suitGenerator]}.png" class="player-cards">`;
    let card = { name: values[valueGenerator], suit: suits[suitGenerator], photo:cardPicture};
    let cardString = `${card.name} of ${card.suit}, ${card.photo}`;

    if (!knownCards.has(cardString)) {
      knownCards.add(cardString);
      cards.push(card);
      console.log(cards.length, cardString);
    }
  }
  for(let i=0; i<cardsPerPlayer; i++){
    playerOne.cards.push(cards[i]);
    playerTwo.cards.push(cards[i + 1]);
    cards.splice(0,3);
  if (players > 2) {
    playerThree.cards.push(cards[i + 2]);
    cards.shift();
  } else if (players > 3) {
    playerFour.cards.push(cards[i + 3]);
    cards.shift();
  } else if (players > 4) {
    playerFive.cards.push(cards[i + 4]);
    cards.shift();
  }
  }
  document.querySelector('.playerCards').innerHTML = `${playerOne.cards[0].photo} <img src ="card-facedown.jpg" class="player-cards"><br> <button onclick="flipCard()">Opening Bet:${startingBet}</button>`;
}
function flipCard(){
   playerOne.chips.oneDollar-= startingBet;
   previousBetValue + 1;
   document.querySelector('.playerCards').innerHTML = `<button onclick="check(true,${previousBetValue})" class="action-button">Meet!</button> <button onclick= "check(true,${previousBetValue + 1})" class="action-button">Raise!</button><button onclick="check(false)"class="action-button">Stand!</button><br> ${playerOne.cards[0].photo} ${playerOne.cards[1].photo}`;
   document.querySelector('.deck').innerHTML ='<img src="card-facedown.jpg" class="player-cards"><br>';
}

function check(didHit, betValue){
  if(!didHit){
    return;
  } else{
    playerOne.chips.oneDollar-= betValue;
    if(playerOne.chips.oneDollar <= 0 || playerOne.chips.oneDollar < betValue) {
      alert('You do not have enough money to bet'|| 'Please match the bet value');
     } else{
      playerOne.cards.push(cards.shift())
      playerOne.i++;
      playerOne.chips.oneDollar-= betValue;
      previousBetValue = betValue;
      document.querySelector('.playerCards').innerHTML += playerOne.cards[playerOne.i].photo;
      playerOne.cards.forEach((card,index)  =>{ if(card === undefined){delete playerOne.cards[index]}})
      }
  }
}