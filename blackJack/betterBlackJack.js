let knownCards = new Set();
let cardsPerPlayer = 2;
let cards = [];
let previousBetValue = 1;
let playerNumber;

function createPlayer(className){
  return {
    cards: [],
    chips: { oneDollar: 20, fiveDollar: 15, tenDollar: 10, twentyFiveDollar: 5, fiftyDollar: 2, hundredDollar: 1 },
    isTurn: false,
    className: className,
    isStanding: false,
    i: 1
  };
}

let players = [createPlayer('player1'),createPlayer('player2'),createPlayer('player3'),createPlayer('player4'),createPlayer('player5')];

function countPlayers(){
  playerNumber = document.getElementById('playerCount').value;
  return playerNumber;
}

function buildDeck() {
  let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      let cardPicture = `<img src="deck-of-cards/${value}_of_${suit}.png">`;
      deck.push({ name: value, suit: suit, photo: cardPicture });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

cards = buildDeck();
shuffle(cards);

function dealCards(){
  const playersPlaying = playerNumber
  for(let i=0; i < playersPlaying; i++){
    players[i].cards.push(cards.shift())
    players[i].cards.push(cards.shift())
  }
  document.querySelector('.initial-page').innerHTML = ``
  document.querySelector('.deck').innerHTML = '<img src="card-facedown.jpg" class="deck">'
  playAudio('sounds/card-flip.mp3');
  revealCards(false);
}

function check(didHit, betValue, player) {
  const playerIndex = players.indexOf(player);

  if (!didHit) {
    // Get all hand values for active players
    let allHands = players.slice(0, playerNumber).map(p => getHandValue(p));
    player.isStanding = true;

    // Get standing status for active players
    const standingValues = players.slice(0, playerNumber).map(p => p.isStanding);
    // Marks busted hands as standing
    allHands.forEach((hand, index) => {
      if (hand > 21) {
        standingValues[index] = true;
      }
    });

    if (standingValues.includes(false)) {
      changeTurns();
      return;
    } else {
      let maxHand = Math.max(...allHands);
      if (maxHand > 21) {
        // Remove busted hands
        allHands = allHands.filter(hand => hand <= 21);
        maxHand = Math.max(...allHands);
      }
      // Find winners
      let winners = players
        .slice(0, playerNumber)
        .map((p, idx) => ({ value: getHandValue(p), index: idx }))
        .filter(hand => hand.value === maxHand && hand.value <= 21);

      if (winners.length > 0) {
        document.querySelector('.results').innerHTML =
          `Winner(s): Player ${winners.map(w => w.index + 1).join(', ')} with ${maxHand}
          <button class="action-button" onclick="resetGame();">Play Again</button>`;
        revealCards(true);
      }
    }
    changeTurns();
  } else {
    player.chips.oneDollar -= betValue;
    if (player.chips.oneDollar <= 0 || player.chips.oneDollar < betValue) {
      alert('You do not have enough money to bet');
      player.isStanding = true;
      changeTurns();
    } else {
      player.cards.push(cards.shift());
      player.i++;
      previousBetValue = betValue;
      document.querySelector(`.${player.className}`).innerHTML += player.cards[player.i].photo;
      player.cards.forEach((card, index) => {
        if (card === undefined) {
          player.cards.splice(index, 1);
        }
      });
      if (player !== players[0]) {
        decideForBot(player);
      } else {
        changeTurns();
      }
    }
  }
}

function playAudio(filePath){
  let audio = new Audio(filePath);
  audio.play().catch(err =>{
    console.error('Sound Error:',err);
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
    totalValue += cardValue;
    if(card.name === 'ace'){
      aceCount++;
    }
  });
  
  while(totalValue > 21 && aceCount >=1){
    totalValue -= 10;
    aceCount--;
  }
  return totalValue;
}

function revealCards(isGameEnded) {
  if (!isGameEnded) {
    let createdDiv = [];
    for (let i = 0; i < playerNumber; i++) {
      createdDiv[i] = document.createElement('div');
      createdDiv[i].classList.add(`player${i + 1}`);
      createdDiv[i].id = String(i + 1);
      document.body.appendChild(createdDiv[i]);
    }

    players.slice(0, playerNumber).forEach((player, index) => {
      const handLength = player.cards.length;
      const playerDiv = document.getElementById(`${index + 1}`);
      if (handLength <= 0) {
        playerDiv.innerHTML = '';
      } else {
        if(playerDiv.id == '1'){
          playerDiv.innerHTML =  `<button onclick="check(true,${previousBetValue},players[0])" class="action-button">Meet!</button> 
          <button onclick="check(true,${previousBetValue + 1},players[0])" class="action-button">Raise!</button>
          <button onclick="check(false,0,players[0])"class="action-button">Stand!</button><br>`
        }
        playerDiv.innerHTML += player.cards.map((card, index) => {
          if(index == 0 && player !== players[0]){
            return `<img src="card-facedown.jpg">`;
          }else{
            return card.photo;
          }
        })
        .join('');
      }
    });
  } else {
    players.slice(0, playerNumber).forEach((player, index) => {
      const playerDiv = document.getElementById(`${index + 1}`);
      if (player.cards.length === 0) {
        console.error('Player Not Found');
        return;
      } else {
        if (playerDiv) {
          playerDiv.innerHTML = '';
          player.cards.forEach(card => {
            playerDiv.innerHTML += card.photo;
          });
        }
      }
    });
  }
}

function decideForBot(player) {
  if (!player || !player.cards || player.cards.length === 0) {
    return;
  }
  let handValue = getHandValue(player);
  if (handValue <= 11) {
    check(true, previousBetValue, player);
  } else {
    check(false, 0, player);
  }
}

function changeTurns() {
  const playerTurns = players.map(player => player.isTurn);

  const currentPlayerIndex = playerTurns.findIndex(p => true);
  if (currentPlayerIndex >= 0) {
    playerTurns[currentPlayerIndex] = false;
    let nextIndex = (currentPlayerIndex + 1) % playerTurns.length;
    playerTurns.forEach(player =>{
      if(player.isStanding && nextIndex <= 5){
        nextIndex++
      } else if(nextIndex > 5){
        nextIndex = 0
      }
    })
    playerTurns[nextIndex] = true;
    if (nextIndex !== 0) {
      setTimeout(() => decideForBot(players[nextIndex]), 500);
    }
  }
}

function checkForBust(){
  let bustArray = [];
  const allHands = players.map(p => getHandValue(p));
  allHands.forEach(hand =>{
    if(hand >21){
      bustArray.push(true);
    }else{
      bustArray.push(false);
    }
  })
  return bustArray;
}

function resetGame() {
  players.forEach(player => {
    player.cards = [];
    player.isStanding = false;
    player.i = 1;
  });
  cards = [];
  cards = buildDeck();
  shuffle(cards);
  previousBetValue = 1;
  clearDivs();
  restoreInitialPage();
}

function clearDivs(){
  for (let i = 1; i <= 5; i++) {
    const div = document.getElementById(`${i}`);
    if (div) {
      div.innerHTML = "";
    }
  }
}

function restoreInitialPage(){
   document.querySelector('.initial-page').innerHTML =  `<div class="initial-page">
      <h1>Pre-Game: Player Count</h1>
      <form class="playerForm">
        <select id="playerCount">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type ="submit" onclick="event.preventDefault(); countPlayers();dealCards()">Confirm</button>
      </form>
      </div>`;
      document.querySelector('.results').innerHTML = '';
      document.querySelector('.deck').innerHTML = '';
}