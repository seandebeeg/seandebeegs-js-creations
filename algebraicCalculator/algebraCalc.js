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
    document.querySelector('.result').textContent = 'Error:Not Supported'
  } else if (shownEquation === undefined){
    document.querySelector('.result').textContent = 'Error:Undefined'
  }
  document.querySelector('.result').textContent = `${eval(shownEquation)}`;
  shownEquation = ''
}
function clearSolution(){
  document.querySelector('.result').textContent='';
}
document.addEventListener("keydown", function(event) {
  if (event.key === "Backspace") {
    shownEquation = shownEquation.slice(0, -1);
  } if (event.key.length === 1 && event.key !== "="){
    shownEquation += event.key;
  }
  if(event.key === "="|"Enter"){
    solve()
  }
  if (event.key === "x"){
    addOperation('*')
    shownEquation = shownEquation.slice(0,-2)+'*'
  }
  if (event.key === "^"){
    addOperation('**')
    shownEquation = shownEquation.slice(0,-3)+'**'
  }
  document.querySelector('.equation').textContent = shownEquation;
});