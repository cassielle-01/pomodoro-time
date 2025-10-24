// Tab Switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Pomodoro Timer
let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;

// Audio notification
const alarmSound = new Audio('audio.mp3'); // Ganti dengan nama file suara Anda

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                pauseTimer();
                playAlarm();
                alert('⏰ Waktu fokus selesai! Saatnya istirahat.');
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    updateDisplay();
}

function playAlarm() {
    alarmSound.play().catch(error => {
        console.log('Tidak dapat memutar suara:', error);
    });
}

// Calculator
let calcValue = '0';

function appendCalc(value) {
    const display = document.getElementById('calcDisplay');
    if (calcValue === '0' && value !== '.') {
        calcValue = value;
    } else {
        calcValue += value;
    }
    display.value = calcValue;
}

function clearCalc() {
    calcValue = '0';
    document.getElementById('calcDisplay').value = calcValue;
}

function calculateResult() {
    try {
        calcValue = eval(calcValue).toString();
        document.getElementById('calcDisplay').value = calcValue;
    } catch (e) {
        document.getElementById('calcDisplay').value = 'Error';
        calcValue = '0';
    }
}

// Notes - Auto Save
const notesInput = document.getElementById('notesInput');

// Load saved notes
const savedNotes = localStorage.getItem('notes');
if (savedNotes) {
    notesInput.value = savedNotes;
}

// Auto-save on input
notesInput.addEventListener('input', () => {
    localStorage.setItem('notes', notesInput.value);
});
