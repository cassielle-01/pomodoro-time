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
let timeLeft;
let timerInterval = null;
let isRunning = false;
let isFocusMode = true;

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
        // Inisialisasi timeLeft jika belum ada
        if (timeLeft === undefined) {
            const focusMin = parseInt(document.getElementById('focusMinutes').value) || 25;
            timeLeft = focusMin * 60;
        }
        
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                pauseTimer();
                playAlarm();
                
                // Alert dan ganti mode
                if (isFocusMode) {
                    alert('⏰ Waktu fokus selesai! Saatnya istirahat.');
                    isFocusMode = false;
                    document.getElementById('timerMode').textContent = 'Mode: Istirahat';
                    const breakMin = parseInt(document.getElementById('breakMinutes').value) || 5;
                    timeLeft = breakMin * 60;
                } else {
                    alert('⏰ Waktu istirahat selesai! Kembali fokus.');
                    isFocusMode = true;
                    document.getElementById('timerMode').textContent = 'Mode: Fokus';
                    const focusMin = parseInt(document.getElementById('focusMinutes').value) || 25;
                    timeLeft = focusMin * 60;
                }
                updateDisplay();
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
    isFocusMode = true;
    const focusMin = parseInt(document.getElementById('focusMinutes').value) || 25;
    timeLeft = focusMin * 60;
    updateDisplay();
    document.getElementById('timerMode').textContent = 'Mode: Fokus';
}

function playAlarm() {
    alarmSound.play().catch(error => {
        console.log('Tidak dapat memutar suara:', error);
    });
}

// Update timer ketika input durasi berubah
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi timer display
    const focusMin = parseInt(document.getElementById('focusMinutes').value) || 25;
    timeLeft = focusMin * 60;
    updateDisplay();
    
    // Event listener untuk perubahan input fokus
    document.getElementById('focusMinutes').addEventListener('change', function() {
        if (!isRunning && isFocusMode) {
            timeLeft = (parseInt(this.value) || 25) * 60;
            updateDisplay();
        }
    });
    
    // Event listener untuk perubahan input istirahat
    document.getElementById('breakMinutes').addEventListener('change', function() {
        if (!isRunning && !isFocusMode) {
            timeLeft = (parseInt(this.value) || 5) * 60;
            updateDisplay();
        }
    });
});

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
document.addEventListener('DOMContentLoaded', function() {
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
});
