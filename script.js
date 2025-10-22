// Tab Switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ===== POMODORO TIMER =====
let timerInterval;
let timeLeft = 1500; // 25 minutes in seconds
let isRunning = false;
let isBreak = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
                alert(isBreak ? 'Waktu istirahat selesai! Yuk lanjut fokus lagi! 💪' : 'Waktu fokus selesai! Waktunya istirahat sebentar! ☕');
                isBreak = !isBreak;
                timeLeft = isBreak ? 300 : 1500; // 5 min break or 25 min focus
                document.getElementById('timer-label').textContent = 
                    isBreak ? '☕ Waktu Istirahat' : '📚 Waktu Fokus';
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
    isBreak = false;
    timeLeft = 1500;
    document.getElementById('timer-label').textContent = '📚 Waktu Fokus';
    updateDisplay();
}

// ===== CALCULATOR =====
let calcDisplay = '0';
let calcExpression = '';

function updateCalcDisplay() {
    document.getElementById('calc-display').textContent = calcDisplay;
}

function appendCalc(value) {
    if (calcDisplay === '0' && value !== '.') {
        calcDisplay = value;
    } else {
        calcDisplay += value;
    }
    updateCalcDisplay();
}

function clearCalc() {
    calcDisplay = '0';
    calcExpression = '';
    updateCalcDisplay();
}

function deleteCalc() {
    if (calcDisplay.length > 1) {
        calcDisplay = calcDisplay.slice(0, -1);
    } else {
        calcDisplay = '0';
    }
    updateCalcDisplay();
}

function calculateResult() {
    try {
        const result = eval(calcDisplay);
        calcDisplay = result.toString();
        updateCalcDisplay();
    } catch (error) {
        calcDisplay = 'Error';
        updateCalcDisplay();
        setTimeout(() => {
            calcDisplay = '0';
            updateCalcDisplay();
        }, 1500);
    }
}

// ===== NOTES =====
let notes = [];

function addNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    
    if (!title || !content) {
        alert('Judul dan isi catatan tidak boleh kosong! ✏️');
        return;
    }

    const note = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString('id-ID')
    };

    notes.unshift(note);
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    displayNotes();
    
    // Animasi feedback
    const addBtn = document.querySelector('.add-note-btn');
    addBtn.textContent = '✅ Berhasil Ditambahkan!';
    setTimeout(() => {
        addBtn.textContent = '➕ Tambah Catatan';
    }, 2000);
}

function deleteNote(id) {
    if (confirm('Yakin ingin menghapus catatan ini? 🗑️')) {
        notes = notes.filter(note => note.id !== id);
        displayNotes();
    }
}

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    
    if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">📝 Belum ada catatan. Mulai tambahkan catatan pertamamu!</div>';
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-item">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>📅 ${note.date}</small>
            <br>
            <button onclick="deleteNote(${note.id})">🗑️ Hapus</button>
        </div>
    `).join('');
}

// ===== INITIALIZE =====
// Jalankan fungsi-fungsi ini saat halaman pertama kali dibuka
updateDisplay();
displayNotes();

// Keyboard support untuk calculator
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Cek apakah sedang di tab calculator
    const calcTab = document.getElementById('calculator');
    if (!calcTab.classList.contains('active')) return;
    
    // Angka 0-9
    if (key >= '0' && key <= '9') {
        appendCalc(key);
    }
    // Operator
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendCalc(key);
    }
    // Titik desimal
    else if (key === '.') {
        appendCalc('.');
    }
    // Enter untuk hitung hasil
    else if (key === 'Enter') {
        event.preventDefault();
        calculateResult();
    }
    // Backspace untuk hapus
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteCalc();
    }
    // Escape untuk clear
    else if (key === 'Escape') {
        clearCalc();
    }
});

// Keyboard support untuk notes (Ctrl/Cmd + Enter untuk tambah catatan)
document.addEventListener('keydown', function(event) {
    const notesTab = document.getElementById('notes');
    if (!notesTab.classList.contains('active')) return;
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        addNote();
    }
});

// Notifikasi motivasi setiap pomodoro selesai
let pomodoroCount = 0;
const motivationalMessages = [
    "Keren! Kamu sudah menyelesaikan 1 sesi fokus! 🎉",
    "Luar biasa! Keep up the good work! 💪",
    "Amazing! Produktivitas level maksimal! ⭐",
    "Hebat sekali! Kamu memang juara! 🏆",
    "Mantap! Terus semangat ya! 🔥"
];

// Update fungsi startTimer untuk menambahkan motivasi
const originalStartTimer = startTimer;
