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
function solve() {
    try {
        const sanitizedEquation = shownEquation.replace(/[^-+*/().0-9]/g, '');
        const result = eval(sanitizedEquation);
        if (!isFinite(result)) {
            document.querySelector('.result').textContent = 'Error: Infinite';
        } else {
            document.querySelector('.result').textContent = result;
        }
    } catch (error) {
        document.querySelector('.result').textContent = 'Error';
    }
    shownEquation = '';
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

// Attach event listeners to buttons
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const value = event.target.getAttribute('data-value');
        if (value === 'solve') {
            solve();
        } else if (value === 'clear') {
            clearCalculator();
        } else {
            addNumber(value);
            clearSolution();
        }
    });
});