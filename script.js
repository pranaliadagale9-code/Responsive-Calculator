// 🔥 ADVANCED CALCULATOR
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

const calcInput = document.getElementById('calc-input');
const calcHistory = document.getElementById('calc-history');

// Number & Decimal
function appendToCalc(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else if (value === '.' && currentInput.includes('.')) {
        return; // Prevent multiple decimals
    } else {
        currentInput += value;
    }
    calcInput.value = currentInput;
}

// Operations
function setOperation(op) {
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
    calcHistory.textContent = `${previousInput} ${getOpSymbol(op)}`;
}

// Calculate
function calculate() {
    if (!operation || !previousInput) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch(operation) {
        case '÷': result = prev / current; break;
        case '×': result = prev * current; break;
        case '-': result = prev - current; break;
        case '+': result = prev + current; break;
        case '%': result = prev * (current / 100); break;
    }
    
    currentInput = result.toString();
    calcInput.value = formatResult(result);
    calcHistory.textContent = `${previousInput} ${getOpSymbol(operation)} ${currentInput} =`;
    
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
}

function getOpSymbol(op) {
    return op === '÷' ? '÷' : op === '×' ? '×' : op;
}

function formatResult(num) {
    if (!isFinite(num)) return 'Error';
    return Math.abs(num) > 999999999 ? num.toExponential(6) : parseFloat(num.toPrecision(12)).toString();
}

// Advanced Functions
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    calcInput.value = '0';
    calcHistory.textContent = '';
    shouldResetDisplay = false;
}

function clearEntry() {
    currentInput = '0';
    calcInput.value = '0';
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') ? 
            currentInput.slice(1) : '-' + currentInput;
        calcInput.value = currentInput;
    }
}

// Button Mappings
document.querySelectorAll('.btn-op').forEach(btn => {
    btn.onclick = () => setOperation(btn.textContent);
});

// PERFECT KEYBOARD SUPPORT
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('calculator').classList.contains('active')) return;
    
    const key = e.key;
    if (key >= '0' && key <= '9' || key === '.') {
        e.preventDefault();
        appendToCalc(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault();
        setOperation(key === '*' ? '×' : key === '/' ? '÷' : key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        e.preventDefault();
        clearEntry();
    }
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tool).classList.add('active');
    });
});

// 🔥 ADVANCED NOTES
const notesText = document.getElementById('notes-text');
const notesStatus = document.getElementById('notes-status');
const lastSaved = document.getElementById('last-saved');

// Load
if (localStorage.getItem('study-notes')) {
    notesText.value = localStorage.getItem('study-notes');
}

// Auto-save
let saveTimeout;
notesText.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    notesStatus.textContent = 'Saving...';
    notesStatus.style.color = '#f59e0b';
    
    saveTimeout = setTimeout(() => {
        localStorage.setItem('study-notes', notesText.value);
        notesStatus.textContent = 'Saved ✓';
        notesStatus.style.color = '#10b981';
        lastSaved.textContent = new Date().toLocaleTimeString();
    }, 1500);
});

function clearNotes() {
    if (confirm('Clear all notes?')) {
        notesText.value = '';
        localStorage.removeItem('study-notes');
        notesStatus.textContent = 'Cleared';
        notesStatus.style.color = '#ef4444';
    }
}