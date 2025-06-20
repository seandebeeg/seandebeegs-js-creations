let shownEquation = '';

function addNumber(num){
  shownEquation =`${shownEquation}${num}`;
  document.querySelector('.equation').textContent = shownEquation;
}

function addOperation(operation){
  shownEquation = `${shownEquation}${operation}`;
  document.querySelector('.equation').textContent = shownEquation;
}

function clearCalculator(){
  shownEquation = '';
  document.querySelector('.equation').textContent = '';
  document.querySelector('.result').textContent = '';
}

function solve(){
  if(isNaN(Number(shownEquation))){
    document.querySelector('.result').textContent = 'Error:Not Supported';
  }else if(!isFinite(Number(eval(shownEquation)))){
    document.querySelector('.result').textContent = 'Infinite';
  }
  document.querySelector('.result').textContent = `${eval(shownEquation)}`;
  shownEquation = ''
}

function clearSolution(){
  document.querySelector('.result').textContent='';
}

document.addEventListener("keydown", function(event) {
  let updated = false;

  if (event.key === "Backspace") {
    shownEquation = shownEquation.slice(0, -1);
    updated = true;
  } else if (event.key === "=" || event.key === "Enter") {
    solve();
    return;
  } else if (event.key === "x") {
    addOperation('*');
    shownEquation = shownEquation.slice(0, -2) + '*';
    updated = true;
  } else if (event.key === "^") {
    addOperation('**');
    shownEquation = shownEquation.slice(0, -3) + '**';
    updated = true;
  } else if (event.key.length === 1 && event.key !== "=") {
    shownEquation += event.key;
    updated = true;
  }

  if (updated) {
    document.querySelector('.equation').textContent = shownEquation;
  }
});