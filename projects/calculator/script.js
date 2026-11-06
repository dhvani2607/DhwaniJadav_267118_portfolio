/**
 * Interactive Calculator
 * College Web Technology Assessment - Practice Project 1
 * Demonstrates: DOM manipulation, event handling, arithmetic evaluation & keyboard accessibility
 */

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    if (this.readyToReset) {
      this.clear();
      return;
    }
    if (this.currentOperand === '0' || this.currentOperand.length === 0) return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.readyToReset) {
      this.currentOperand = '';
      this.readyToReset = false;
    }
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  percent() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
  }

  negate() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current) || current === 0) return;
    this.currentOperand = (-current).toString();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          alert('Cannot divide by zero!');
          this.clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Limit decimal precision to prevent float precision issues
    computation = Math.round(computation * 100000000) / 100000000;
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.readyToReset = true;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (this.currentOperand === '') {
      this.currentOperandTextElement.innerText = '0';
    } else {
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    }

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const previousOperandTextElement = document.getElementById('previous-operand');
  const currentOperandTextElement = document.getElementById('current-operand');
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

  // Number buttons
  document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.getAttribute('data-number'));
      calculator.updateDisplay();
    });
  });

  // Operator buttons
  document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.getAttribute('data-operator'));
      calculator.updateDisplay();
    });
  });

  // Action buttons
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      if (action === 'calculate') {
        calculator.compute();
      } else if (action === 'all-clear') {
        calculator.clear();
      } else if (action === 'delete') {
        calculator.delete();
      } else if (action === 'percent') {
        calculator.percent();
      } else if (action === 'negate') {
        calculator.negate();
      }
      calculator.updateDisplay();
    });
  });

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      calculator.appendNumber(e.key);
      calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-') {
      calculator.chooseOperation(e.key);
      calculator.updateDisplay();
    } else if (e.key === '*') {
      calculator.chooseOperation('×');
      calculator.updateDisplay();
    } else if (e.key === '/') {
      e.preventDefault();
      calculator.chooseOperation('÷');
      calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      calculator.compute();
      calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
      calculator.delete();
      calculator.updateDisplay();
    } else if (e.key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
    }
  });
});
