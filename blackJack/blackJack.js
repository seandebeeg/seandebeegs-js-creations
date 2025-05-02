alert('No real money is involved in the playing of this game');
let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let knownCards = new Set();
let players = 2;
let cardsPerPlayer = 2;
let playerOne = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1, isTurn:true};
let playerTwo = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:true};
let playerThree = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:true};
let playerFour = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:true};
let playerFive = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:true};
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
    } else if(players > 4){
      playerFive.cards.push(cards[i+4])
    }
  }
  document.querySelector('.initial-page').innerHTML = ``
  document.querySelector('.playerCards').innerHTML = `${playerOne.cards[0].photo} <img src ="card-facedown.jpg" class="player-cards"><br> <button onclick="flipCard()">Opening Bet:${previousBetValue}</button>`;
  playAudio('sounds/woosh.mp3');
}
function flipCard(player) {
  player.chips.oneDollar -= previousBetValue;
  previousBetValue += 1;
  if(player === playerOne){document.querySelector('.playerCards').innerHTML = `<button onclick="check(true,${previousBetValue},playerOne)" class="action-button">Meet!</button> <button onclick="check(true,${previousBetValue + 1},playerOne)" class="action-button">Raise!</button><button onclick="check(false)"class="action-button">Stand!</button><br> ${playerOne.cards[0].photo} ${playerOne.cards[1].photo}`;}
  playAudio('sounds/woosh.mp3')
  document.querySelector('.deck').innerHTML = '<img src="card-facedown.jpg" class="player-cards"><br>';
  checkForBust(player);
}

function check(didHit, betValue, player) {
  if(player == undefined){
    console.error('Player not found :', player)
  }else{
    if (!didHit) {
      let allHands = [playerOne.cards, playerTwo.cards, playerThree.cards, playerFour.cards]
        .slice(0, players).map(cards => getHandValue({cards})); 
      
      const maxHand = Math.max(...allHands);
      const winners = allHands
        .map((value, index) => ({value, index}))
        .filter(hand => hand.value === maxHand && hand.value <= 21);
      if (winners.length > 0|| winners.length > 1) {
        if(winners[0].length > winners[1]){
          document.querySelector('.results').innerHTML = 
          `Winner(s): Player ${winners.map(w => w.index + 1).join(', ')} with ${maxHand}`;
        }
        document.querySelector('.results').innerHTML = 
          `Winner(s): Player ${winners.map(w => w.index + 1).join(', ')} with ${maxHand}`;
      } else {
        document.querySelector('.results').innerHTML = 'Everyone busted!';
      }
    } else {
      playerOne.chips.oneDollar -= betValue;
      if (playerOne.chips.oneDollar <= 0 || playerOne.chips.oneDollar < betValue) {
        alert('You do not have enough money to bet');
      } else {
        player.cards.push(cards.shift());
        player.i++;
        player.chips.oneDollar -= betValue;
        previousBetValue = betValue;
        document.querySelector('.playerCards').innerHTML += playerOne.cards[playerOne.i].photo;
        playerOne.cards.forEach((card, index) => { if (card === undefined) { delete playerOne.cards[index] } });
        checkForBust(playerOne);
      }
    }
  }
}

function playAudio(filePath){
  audio = new Audio(filePath);
  audio.play().catch(err =>{
    console.error('Sound Error:',err)
  })
}

function getCardValue(card) {
  if (card.name === 'ace') {
    return 11;
  } else if (['jack', 'queen', 'king'].includes(card.name)) {
    return 10;
  } else {
    return parseInt(card.name);
  }
}

function getHandValue(player){
  let totalValue = 0;
  let aceCount = 0;

  player.cards.forEach(card => {
    let cardValue = getCardValue(card)
    totalValue += cardValue
    console.log(totalValue)
    if(card.name === 'ace'){
      aceCount++
    }
  });
  
  while(totalValue > 21 && aceCount >=1){
    totalValue -= 10;
    aceCount--
  }
  return totalValue;
}

function checkForBust(player){
  const handValue = getHandValue(player)
  if(handValue === 21){
    document.querySelector('.results').innerHTML = `You got a blackjack`
    document.querySelector('.player2').innerHTML = playerTwo.cards[0].photo + playerTwo.cards[1].photo; 
  }else if(handValue > 21){
    document.querySelector('.results').innerHTML = `You have busted`
    document.querySelector('.player2').innerHTML = playerTwo.cards[0].photo + playerTwo.cards[1].photo; 
  }
}

function revealCards(){
  let createdDiv =[]
  for(let i=0; i<=2;i++){
    createdDiv.push(document.createElement('div'));
  }
  createdDiv.forEach((div,index) => {
    div.classList.add(`player${index+2}`)
  });
  let allHands = [playerOne.cards, playerTwo.cards,playerThree.cards,playerFour.cards];
  allHands.forEach((hand, index) => {
    const handLength = hand.length;
    if(handLength <=0){
      delete createdDiv[index-1];
      delete hand;
      return;
    } else{
      document.querySelector(`.player${index+1}`).innerHTML = hand[0].photo +`<img src="card-facedown.jpg" class="player${index+1}">`
    }
  });
}

function decideForBot(player){
  let cardValue = getHandValue(player);
  if(cardValue <= 11){
    flipCard(player);
  }else{
    checkTurns();
    return;
  }
}