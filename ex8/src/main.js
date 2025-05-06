import './style.css'


const input = document.querySelector('#input');
const result = document.querySelector('#result');
const buttons = document.querySelectorAll('.grid button');

function calculator(button) {
  if (button.textContent != "=" && button.textContent != "+/-") {
    result.textContent += button.textContent;
  }
  if (button.textContent === 'C') {
    input.textContent = '';
    result.textContent = '';
  }else if (button.textContent === '=') {
    try {
      input.textContent = result.textContent;
      let expression = input.textContent;
      expression = expression.replace(/x/g, '*');
      expression = expression.replace(/÷/g, '/');
      result.textContent = eval(expression);
    } catch (error) {
      result.textContent = 'Error';
    }
  }else if (button.textContent === '+/-') {
    result.textContent = -(result.textContent);
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    calculator(button);
  });
});