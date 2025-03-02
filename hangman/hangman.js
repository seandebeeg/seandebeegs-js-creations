let pickedCatagory = '';
let pickedWord = '';
let trash = [];
let trashIndex = 0;
let lives = 5;
let hiddenWord = Array(pickedWord.length).fill('_');
let arrayWord = Array.from(pickedWord);
let arrayHiddenWord = Array.from(hiddenWord);
let gameLock = false;
let record = JSON.parse(localStorage.getItem('hangmanRecord')) || {win: 0, lose: 0 };
const catagories = ['Kitchen Appliance','Electronics','House Items','Bussiness Items','Musical Instruments'];
function generateCatagory(){
  const picker = Math.floor(Math.random()* catagories.length);
  pickedCatagory = catagories[picker];
  document.querySelector('.catagory').textContent = `${pickedCatagory}`;
};

function generateWord(){
 const kitchenAppliances = ['Dishwasher','Sink','Oven','Stove'];
 const electronics = ['Cellphone','Computer','Game console','Speaker','Television','Mouse','Keyboard'];
 const houseItems =['Bed','Toilet','Shower','Shelf','Counter'];
 const bussinessItems = ['Cubicle','Meeting Room','Office Phone','Desk','Chair'];
 const musicalIntsruments =['Trumpet','Violin','Piano','French Horn','Tuba','Viola','Xylophone']
 let picker ='';
 if(pickedCatagory === 'Kitchen Appliance'){
    picker = Math.floor(Math.random()* kitchenAppliances.length);
    pickedWord = kitchenAppliances[picker];
 } 
 else if (pickedCatagory === 'Electronics'){
   picker = Math.floor(Math.random()* electronics.length);
   pickedWord = electronics[picker];
 } 
 else if (pickedCatagory === 'House Items'){
    picker = Math.floor(Math.random()* houseItems.length);
    pickedWord = houseItems[picker];
 } 
 else if(pickedCatagory === 'Bussiness Items'){
    picker = Math.floor(Math.random()* bussinessItems.length);
    pickedWord = bussinessItems[picker];
 }
 else if(pickedCatagory === 'Musical Instruments'){
  picker = Math.floor(Math.random()* musicalIntsruments.length)
  pickedWord = musicalIntsruments[picker]
 }
 if(pickedWord.includes(' ')){
   pickedWord = pickedWord.replaceAll(' ', '');
 }
 const wordLength = pickedWord.length;
 hiddenWord = Array(wordLength).fill('_');
 hiddenWord = String(hiddenWord).replaceAll(',', ' ');
 arrayWord = Array.from(pickedWord);
 arrayHiddenWord = Array.from(hiddenWord);
 document.querySelector('.characters').textContent =`Letters: ${wordLength}`;
 document.querySelector('.word').textContent = `${hiddenWord}`;
}
 function replay(){
  lives = 5;
  trash = [];
  trashIndex = 0;
  gameLock = false;
  generateCatagory();
  generateWord();
  document.querySelector('.result').innerHTML ='';
  document.querySelector('.trash').innerHTML = '';
 }
document.addEventListener("keydown", function(event){  
  if(event.key.length === 1 && /^[a-zA-Z]$/.test(event.key) && gameLock === false){
    let guess = event.key.toLowerCase();
    let updated = false;

    for (let i = 0; i < pickedWord.length; i++) {
      if (pickedWord[i].toLowerCase() === guess) {
        arrayHiddenWord[i*2] = pickedWord[i];
        updated = true;
      }
    }

    if (updated) {
      hiddenWord = arrayHiddenWord.join('');
      document.querySelector('.word').textContent = arrayHiddenWord.join(' ');
      if(hiddenWord.replaceAll(' ','') === pickedWord) {
        gameLock = true;
        document.querySelector('.result').innerHTML = 'You won! <br> <button class ="replay-btn" onclick="replay();">Replay</button>';
        record.win++;
        document.querySelector('.record').innerHTML = `Wins: ${record.win} Losses: ${record.lose}`;
        localStorage.setItem('hangmanRecord', JSON.stringify(record));
      }
    } else {
      lives--;
      trash.push(guess);
      trashIndex++;
      document.querySelector('.trash').textContent = `${trash}`;
    }
    if (lives === 0) {
      gameLock = true;
      document.querySelector('.result').innerHTML = `You lost! The word was ${pickedWord}. <br> <button class ="replay-btn" onclick="replay()">Replay</button>`;
      record.lose++;
      localStorage.setItem('hangmanRecord', JSON.stringify(record));
    }
  }
  else if(gameLock === true){
    document.querySelector('.result').innerHTML = `Please press the replay button to play again.<br> <button class ="replay-btn" onclick="replay()">Replay</button>`;
  }
});