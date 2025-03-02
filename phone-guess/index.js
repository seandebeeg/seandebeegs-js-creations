const phones = [
  {phoneModel:'Apple iPhone 16',ram:'8GB',camera:'48MP',chip:'A18 Bionic Chip',screenSize:'6.1in Screen',screenFPS:'120hz',battery:'3800mAh',brand:'Apple' ,photo:'<img src="phone-pics/iphone-16.png">' },
  {phoneModel:'Apple iPhone 15',ram:'6GB',camera:'48MP',chip:'A16 Bionic Chip',screenSize:'6.1in Screen',screenFPS:'120hz',battery:'3300  mAh',brand:'Apple' ,photo:'<img src="phone-pics/iphone-15.png">' },
  {phoneModel:'Apple iPhone 14',ram:'6GB',camera:'Dual 12MP',chip:'A15 Bionic Chip',screenSize:'6.1in Screen',screenFPS:'60hz',battery:'3279mAh',brand:'Apple' ,photo:'<img src="phone-pics/iphone-14.png">' },
  {phoneModel:'Apple iPhone 13',ram:'4GB',camera:'Dual 12MP',chip:'A15 Bionic Chip',screenSize:'6.1in Screen',screenFPS:'60hz',battery:'3240mAh',brand:'Apple',photo:'<img src="phone-pics/iphone-13.png">'},
  {phoneModel:'Samsung Galaxy S25',ram:'12GB',camera:'50MP',chip:' Snapdragon 8 Elite',screenSize:'6.2in Screen',screenFPS:'120hz',battery:'4000mAh',brand:'Samsung',photo:'<img src="phone-pics/samsung-s25.png">'},
  {phoneModel:'Samsung Galaxy S24',ram:'8GB',camera:'50MP',chip:'Exynos 2400 ',screenSize:'6.1in Screen',screenFPS:'120hz',battery:'3900mAh',brand:'Samsung',photo:'<img src="phone-pics/samsung-s24.png">'},
  {phoneModel:'Samsung Galaxy S23',ram:'8GB',camera:'50MP',chip:'Snapdragon 8 Gen 2',screenSize:'6.1in Screen',screenFPS:'120hz',battery:'3900mAh',brand:'Samsung',photo:'<img src="phone-pics/samsung-s23.png">'}
];
//The photo is an element to quickly add to the innerHTML of the results class
let guesses = 3;
let chosenPhone;
let specIndex = 2; //ensures that you don't get duplicate specs on a guess click
let allChosenSpecs;
let gameLock = false; // prevents undefined from appearing when clicking too much

function choosePhone(){
  const phoneSelector = Math.floor(Math.random()*phones.length);
  chosenPhone = phones[phoneSelector];
  allChosenSpecs = [`<p class="spec">RAM:${chosenPhone.ram}</p>`,`<p class="spec">Camera:${chosenPhone.camera}</p>`,`<p class="spec">Screen Size:${chosenPhone.screenSize}</p>`, `<p class="spec">Battery:${chosenPhone.battery}</p>`, `<p class="spec">Processer:${chosenPhone.chip}</p>`,`<p class="spec">Brand:${chosenPhone.brand}</p>`, `<p class="spec">Model:${chosenPhone.phoneModel}</p>`]
 for(let i=0; i <=2;i++){
  document.getElementById('specs').innerHTML += allChosenSpecs[i]; 
  setTimeout(function(){
    playSound('sounds/woosh.mp3');
    const element = document.querySelectorAll('.spec');
    element.forEach(paragraph => {paragraph.classList.add('visible');})
  },1000)
 }
  gameLock = false;
}

function guessPhone(){
  const phoneGuess = document.getElementById('phoneSelect').value;
  if(phoneGuess === chosenPhone.phoneModel && gameLock === false){
    playSound('sounds/correct.mp3')
    document.querySelector('.results').innerHTML = `<p class="message">Correct the phone was ${phoneGuess}</p><br>${chosenPhone.photo}<button onclick="playAgain();" class="play-again">Play Again</button>`;
    gameLock = true;
  } else if(phoneGuess !== chosenPhone.phoneModel && gameLock === false){
    specIndex++;
    document.querySelector('.specs').innerHTML += allChosenSpecs[specIndex]; 
    setTimeout(function(){
      playSound('sounds/woosh.mp3')
      const element = document.querySelectorAll('.spec');
      element.forEach(paragraph => {paragraph.classList.add('visible');})
    },1000)
    if(guesses <= 0) {
      playSound('sounds/lose.mp3')
      document.querySelector('.results').innerHTML = ` <p class="message">You lose the phone was ${chosenPhone.phoneModel}</p><br>${chosenPhone.photo}<br><button onclick="playAgain();" class="play-again">Play Again</button>`;
      gameLock = true;
    }
    guesses--;
  } else{
    alert('The Game has ended please press play again');
  }
}

function playAgain(){
  document.querySelector('.results').innerHTML = '';
  document.querySelector('.specs').innerHTML = '';
  guesses = 3;
  specIndex = 2;
  choosePhone();
}

function playSound(path){
  const sound = new Audio(path)
  sound.autoplay = true;
  sound.play().catch(err => {
    console.error('Sound Error:',err)
  }) 
}

document.addEventListener("DOMContentLoaded", function(){
  choosePhone();
  setTimeout(function(){
    playSound('sounds/woosh.mp3');
    const element = document.querySelectorAll('.spec');
    element.forEach(paragraph => {paragraph.classList.add('visible');})
  },1000)
});