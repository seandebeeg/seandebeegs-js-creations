let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let knownCards = new Set();
let players = 2;
let cardsPerPlayer = 2;
let playerOne = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1, isTurn:true,className:'player1',isStanding:false};
let playerTwo = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player2',isStanding:false};
let playerThree = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player3',isStanding:false};
let playerFour = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player4',isStanding:false};
let playerFive = {cards:[],chips:{oneDollar:20,fiveDollar:15,tenDollar:10,twentyFiveDollar:5,fiftyDollar:2,hundredDollar:1}, i:1,isTurn:false,className:'player5',isStanding:false};
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
   playerOne.cards.push(cards.shift())
   playerTwo.cards.push(cards.shift())
   if(players>2){
    playerThree.cards.push(cards.shift())
    if(players>3){
      playerFour.cards.push(cards.shift())
      if(players>4){
        playerFive.cards.push(cards.shift())
       }
     }
   } 
  }
  document.querySelector('.initial-page').innerHTML = ``
  document.querySelector('.deck').innerHTML = '<img src="card-facedown.jpg" class="deck">'
  revealCards(false);
  document.querySelector('.player1').innerHTML = `${playerOne.cards[0].photo} <img src ="card-facedown.jpg" class="player1"><br> <button onclick="flipCard(playerOne)" class="action-button">Opening Bet:${previousBetValue}</button>`;
  playAudio('sounds/card-flip.mp3');
}
function flipCard(player) {
  player.chips.oneDollar -= previousBetValue;
  previousBetValue += 1;
  if(player === playerOne){
    document.querySelector('.player1').innerHTML = `<button onclick="check(true,${previousBetValue},playerOne)" class="action-button">Meet!</button> <button onclick="check(true,${previousBetValue + 1},playerOne)" class="action-button">Raise!</button><button onclick="check(false,0,playerOne)"class="action-button">Stand!</button><br> ${playerOne.cards[0].photo} ${playerOne.cards[1].photo}`;
  }
  playAudio('sounds/card-flip.mp3')
}

function check(didHit, betValue, player) {
    if (!didHit){
       let allHands = [playerOne.cards, playerTwo.cards, playerThree.cards, playerFour.cards, playerFive.cards]
        .slice(0, players).map(cards => getHandValue({cards})); 
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
        console.log(standingValues)
        changeTurns()
        return;
      } else{
        let maxHand = Math.max(...allHands);
        if(maxHand > 21){
          allHands.forEach((hand,index)=>{
            if(hand > 21){
              allHands[index].remove()
            }
          })
        }
        let winners = allHands
          .map((value, index) => ({value, index}))
          .filter(hand => hand.value === maxHand && hand.value <= 21);
        const allBusts = checkForBust();
        if (winners.length > 0) {
            document.querySelector('.results').innerHTML = 
              `Winner(s): Player ${winners.map(w => w.index + 1).join(', ')} with ${maxHand}`;
            revealCards(true)
        } if(allBusts.includes(true)){
          const bustedIndex = allBusts.findIndex(true)
          document.querySelector('.results').innerHTML = 
            `Player ${bustedIndex + 1} has busted`
          revealCards(true)
          changeTurns()
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
  audio = new Audio(filePath);
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
       console.log(playerDiv);
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
    console.log(nextIndex)
    players.forEach(player =>{
      if(player.isStanding && nextIndex <= 5){
        nextIndex++
        console.log(nextIndex)
      } else if(nextIndex > 5){
        nextIndex = 0
      }
    })
    players[nextIndex].player.isTurn = true;
    console.log(nextIndex)
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