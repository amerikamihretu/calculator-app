const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Update display text
function updateDisplay(value) {
    display.textContent = value || '0';
}

// Number button handler
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    // Prevent multiple leading zeros
    if (num === '0' && currentInput === '0') return;
    if (num !== '0' && currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay(currentInput);
}

// Decimal handler
function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
        updateDisplay(currentInput);
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
}

// Operator handler
function handleOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

// Calculation logic
function calculate() {
    if (operator === null || shouldResetDisplay) return;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': result = curr !== 0 ? prev / curr : 'Error'; break;
        case '%': result = prev % curr; break;
        default: return;
    }
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    updateDisplay(currentInput);
    shouldResetDisplay = true;
}

// Clear
function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay('0');
}

// Delete last character
function deleteLast() {
    if (shouldResetDisplay) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') updateDisplay('0');
    else updateDisplay(currentInput);
}

// Event delegation
document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'number') {
        inputNumber(btn.dataset.value);
    } else if (action === 'decimal') {
        inputDecimal();
    } else if (action === 'operator') {
        handleOperator(btn.dataset.value);
    } else if (action === 'calculate') {
        calculate();
    } else if (action === 'clear') {
        clearAll();
    } else if (action === 'delete') {
        deleteLast();
    }
});

// Keyboard support (extra touch)
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') inputNumber(key);
    if (key === '.') inputDecimal();
    if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') handleOperator(key);
    if (key === 'Enter' || key === '=') { e.preventDefault(); calculate(); }
    if (key === 'Escape') clearAll();
    if (key === 'Backspace') deleteLast();
});