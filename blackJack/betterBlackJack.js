let knownCards = new Set();
let cardsPerPlayer = 2;
let cards = [];
let previousBetValue = 1;

function createPlayer(){
  return {
    cards: [],
    chips: { oneDollar: 20, fiveDollar: 15, tenDollar: 10, twentyFiveDollar: 5, fiftyDollar: 2, hundredDollar: 1 },
    isTurn: false,
    className,
    isStanding: false
  };
}

let players = [createPlayer('player1'),createPlayer('player2'),createPlayer('player3'),createPlayer('player4'),createPlayer('player5')];

function countPlayers(){
  let playerNumber = document.getElementById('playerCount').value
  while(playerNumber !== players.length){
    players.pop()
  }
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
  const playersPlaying = players.length
  for(let i=0; i < peoplePlaying; i++){

  }
}

function check(didHit, betValue, player) {
    if (!didHit){
       let allHands = players.slice(0, players.length).map(player => getHandValue({player})); 
      console.log(allHands)
      player.isStanding = true;
      const playerStandingStatus = {p1:playerOne.isStanding,p2:playerTwo.isStanding,p3:playerThree.isStanding,p4:playerFour.isStanding,p5:playerFive.isStanding}
      const standingValues = Object.values(playerStandingStatus)
        while(standingValues.length > players){
          standingValues.pop()
        }
        allHands.forEach((hand,index) =>{
          if(hand > 21){
            standingValues[index] = true
          }
        })
      if(standingValues.includes(false)){
        changeTurns()
        return;
      } else{
        let maxHand = Math.max(...allHands);
        console.log(maxHand)
        if(maxHand > 21){
          allHands.forEach((hand, index) => {
            if (hand > 21) {
              allHands[index] = 1;
              allHands.splice(index, 1);
              console.log(allHands);
            }
          })
           maxHand = Math.max(...allHands);
           console.log(maxHand)
        }
        let winners = allHands
          .map((value, index) => ({value, index}))
          .filter(hand => hand.value === maxHand && hand.value <= 21);
          console.log(winners.length)
        if (winners.length > 0) {
            document.querySelector('.results').innerHTML = 
              `Winner(s): Player ${winners.map(w => w.index + 1).join(', ')} with ${maxHand}
              <button class = "action-button" onclick = "resetGame();">Play Again</button>`;
            revealCards(true)
        }
      }
      changeTurns()
    } else {
      player.chips.oneDollar -= betValue;
      if (player.chips.oneDollar <= 0 || player.chips.oneDollar < betValue) {
        alert('You do not have enough money to bet');
        changeTurns()
      } else {
        player.cards.push(cards.shift());
        player.i++;
        player.cards[player.i].photo =  player.cards[player.i].photo.replaceAll('>',`class="${player.className}">`);
        player.chips.oneDollar -= betValue;
        previousBetValue = betValue;
        document.querySelector(`.${player.className}`).innerHTML += player.cards[player.i].photo;
        player.cards.forEach((card, index) => { 
          if (card === undefined){ 
            playerOne.cards[index].pop(); 
          }
        });
        if(player !== playerOne){
          decideForBot();
        } else{
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

function revealCards(isGameEnded){
  if(!isGameEnded){
    let createdDiv = []
    for(let i=0; i<players; i++){
      createdDiv.push(document.createElement('div'));
      createdDiv[i].classList.add(`player${i+1}`);
      document.body.appendChild(createdDiv[i]);
    }
    createdDiv.forEach((div,index)=>{
      createdDiv[index].id = String(index + 1);
    });
    
    let allHands = [playerOne.cards, playerTwo.cards, playerThree.cards, playerFour.cards,playerFive.cards];
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
  } else{
     let allHands = [playerOne.cards, playerTwo.cards, playerThree.cards, playerFour.cards,playerFive.cards];

     allHands.forEach((hand,index) =>{
        if(hand.length == 0){
          allHands.splice(index)
          console.error('Player Not Found')
        }
        let playerDiv = document.getElementById(`${index+1}`)
        playerDiv.innerHTML =''
        hand.forEach((card) =>{
        playerDiv.innerHTML+= card.photo
       })
     })
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
  const players = [
    { player: playerOne, isTurn: playerOne.isTurn },
    { player: playerTwo, isTurn: playerTwo.isTurn },
    { player: playerThree, isTurn: playerThree.isTurn },
    { player: playerFour, isTurn: playerFour.isTurn },
    { player: playerFive, isTurn: playerFive.isTurn }
  ];

  const currentPlayerIndex = players.findIndex(p => p.isTurn);
  if (currentPlayerIndex >= 0) {
    players[currentPlayerIndex].player.isTurn = false;
    let nextIndex = (currentPlayerIndex + 1) % players.length;
    players.forEach(player =>{
      if(player.isStanding && nextIndex <= 5){
        nextIndex++
      } else if(nextIndex > 5){
        nextIndex = 0
      }
    })
    players[nextIndex].player.isTurn = true;
    if (players[nextIndex].player !== playerOne) {
      setTimeout(() => decideForBot(players[nextIndex].player), 500);
    }
  }
}

function checkForBust(){
  let bustArray = [];
  const allHands = [playerOne.cards, playerTwo.cards,playerThree.cards,playerFour.cards,playerFive.cards];
  allHands.forEach(hand =>{
    if(hand >21){
      bustArray.push(true);
    }else{
      bustArray.push(false);
    }
  })
  return bustArray;
}

function resetGame(){
  playerOne.cards = [];
  playerTwo.cards = [];
  playerThree.cards = []; 
  playerFour.cards = []; 
  playerFive.cards = [];
  cards = [];
  previousBetValue = 1;
  clearDivs()
  restoreInitialPage()
  dealCards()
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
        <button type ="submit" onclick="event.preventDefault(); dealCards()">Confirm</button>
      </form>
      </div>`;
}
