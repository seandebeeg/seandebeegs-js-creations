alert('No real money is involved in the playing of this game');
let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let knownCards = new Set();
let players = 2;
let cardsPerPlayer = 2;
let playerOne = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1, isTurn:true,className:'player1'};
let playerTwo = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player2'};
let playerThree = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player3'};
let playerFour = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player4'};
let playerFive = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player5'};
let cards = [];
let previousBetValue = 1;

function dealCards() {
  players = document.getElementById('playerCount').value;
  while (cards.length < 52) {
    let valueGenerator = Math.floor(Math.random() * values.length);
    let suitGenerator = Math.floor(Math.random() * suits.length);
    let cardPicture = `<img src="deck-of-cards/${values[valueGenerator]}_of_${suits[suitGenerator]}.png">`;
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
  document.querySelector('.deck').innerHTML = '<img src="card-facedown.jpg" class="deck">'
  revealCards(false);
  document.querySelector('.player1').innerHTML = `${playerOne.cards[0].photo} <img src ="card-facedown.jpg" class="player1"><br> <button onclick="flipCard(playerOne)">Opening Bet:${previousBetValue}</button>`;
  playAudio('sounds/card-flip.mp3');
}
function flipCard(player) {
  player.chips.oneDollar -= previousBetValue;
  previousBetValue += 1;
  if(player === playerOne){
    document.querySelector('.player1').innerHTML = `<button onclick="check(true,${previousBetValue},playerOne)" class="action-button">Meet!</button> <button onclick="check(true,${previousBetValue + 1},playerOne)" class="action-button">Raise!</button><button onclick="check(false,0,playerOne)"class="action-button">Stand!</button><br> ${playerOne.cards[0].photo} ${playerOne.cards[1].photo}`;
  }
  playAudio('sounds/card-flip.mp3')
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
      player.chips.oneDollar -= betValue;
      if (player.chips.oneDollar <= 0 || player.chips.oneDollar < betValue) {
        alert('You do not have enough money to bet');
      } else {
        player.cards.push(cards.shift());
        player.i++;
        player.cards[player.i].photo =  player.cards[player.i].photo.replaceAll('>',`class="${player.className}">`)
        player.chips.oneDollar -= betValue;
        previousBetValue = betValue;
        document.querySelector(`.${player.className}`).innerHTML += player.cards[player.i].photo;
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

function revealCards(isGameEnded){
  if(!isGameEnded){
    let createdDiv = []
    for(let i=0; i<4; i++){
      createdDiv.push(document.createElement('div'));
      createdDiv[i].classList.add(`player${i+1}`);
      document.body.appendChild(createdDiv[i]);
    }
    createdDiv.forEach((div,index)=>{
      createdDiv[index].id = `${index+1}`
    });
    
    let allHands = [playerOne.cards, playerTwo.cards, playerThree.cards, playerFour.cards];
    allHands.forEach((hand, index) => {
      const handLength = hand.length;
      if(handLength <= 0){
        if(createdDiv[index]) {
          createdDiv[index].remove();
        }
        delete hand;
        return;
      } else {
        hand.forEach(card =>{
          card.photo = card.photo.replaceAll(">",`class="player${index+1}">`)
        });
        document.body.insertBefore(document.getElementById('2'),document.getElementById('deck'))
        document.querySelector(`.player${index+1}`).innerHTML = 
          hand[0].photo + `<img src="card-facedown.jpg" class="player${index+1}">`;
      }
    });
  }
}

function decideForBot(player){
  let handValue = getHandValue(player);
  if(handValue <= 11){
    check(true,previousBetValue,player);
    changeTurns();
  }else{
    changeTurns()
    check(false,0,player);
    return;
  }
}

function changeTurns(){
  if(playerOne.isTurn){
    playerTwo.isTurn = true
    decideForBot(playerTwo)
  } else if(playerTwo.isTurn){
    playerThree.isTurn = true
    decideForBot(playerThree)
  } else if(playerThree.isTurn){
    playerFour.isTurn = true
    decideForBot(playerFour)
  } else if(playerFour.isTurn){
    playerFive.isTurn = true
    decideForBot(playerFive)
  } else if(playerFive.isTurn){
    playerOne.isTurn = true
  }
}