// =======================================
// 1. Variabel Utama (Elements & State)
// =======================================

// Ambil elemen-elemen dari HTML
const timeDisplay = document.getElementById('timeDisplay');
const modeLabel = document.getElementById('modeLabel');
const startPauseButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
const skipButton = document.getElementById('skip');
const focusTimeInput = document.getElementById('focusTime');
const breakTimeInput = document.getElementById('breakTime');
const sessionsDisplay = document.getElementById('sessions');
const statusDisplay = document.getElementById('status');

// Variabel status timer
let isRunning = false;
let isFocusMode = true;
let totalSeconds = 0;
let secondsRemaining = 0;
let timerInterval = null;
let sessionsCompleted = 0;

// =======================================
// 2. Fungsi Utama Timer
// =======================================

/**
 * Memulai atau menghentikan (pause) timer.
 */
function startPauseTimer() {
    if (isRunning) {
        // Menghentikan (Pause)
        clearInterval(timerInterval);
        isRunning = false;
        startPauseButton.textContent = 'Lanjut';
        statusDisplay.textContent = 'Jeda';
    } else {
        // Memulai (Start)
        isRunning = true;
        startPauseButton.textContent = 'Jeda';
        statusDisplay.textContent = isFocusMode ? 'Fokus' : 'Istirahat';

        // Setel waktu jika ini adalah kali pertama dimulai atau setelah reset
        if (secondsRemaining === 0) {
            setupTimer();
        }

        // Mulai hitungan mundur setiap 1 detik
        timerInterval = setInterval(countdown, 1000);
    }
}

/**
 * Fungsi hitungan mundur yang berjalan setiap detik.
 */
function countdown() {
    secondsRemaining--;

    if (secondsRemaining < 0) {
        // Waktu habis!
        clearInterval(timerInterval);
        
        // 🚨 PENGINGAT (Audio)
        playNotificationSound(); 
        
        // Ganti mode
        toggleMode();
        
        // Mulai mode baru secara otomatis
        startPauseTimer(); 
    } else {
        updateDisplay();
    }
}

/**
 * Memperbarui tampilan waktu di HTML.
 */
function updateDisplay() {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    
    // Format waktu menjadi MM:SS (misalnya 05:03)
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeDisplay.textContent = formattedTime;
    
    // Opsional: Perbarui title browser untuk melihat waktu saat minimize
    document.title = formattedTime + (isFocusMode ? ' (Fokus)' : ' (Break)');
}

/**
 * Mengganti mode dari Fokus ke Istirahat, atau sebaliknya.
 */
function toggleMode() {
    if (isFocusMode) {
        // Sesi fokus selesai
        sessionsCompleted++;
        sessionsDisplay.textContent = sessionsCompleted;
        isFocusMode = false;
        modeLabel.textContent = 'Istirahat';
        modeLabel.style.color = '#A9D18E'; // Warna hijau (Sesuai CSS)
    } else {
        // Sesi istirahat selesai
        isFocusMode = true;
        modeLabel.textContent = 'Fokus';
        modeLabel.style.color = '#FFB3C0'; // Warna pink (Sesuai CSS)
    }
    
    // Siapkan timer untuk mode yang baru
    setupTimer();
}

/**
 * Mengambil nilai dari input dan menyiapkan timer.
 */
function setupTimer() {
    const focusMinutes = parseInt(focusTimeInput.value);
    const breakMinutes = parseInt(breakTimeInput.value);

    if (isFocusMode) {
        totalSeconds = focusMinutes * 60;
    } else {
        totalSeconds = breakMinutes * 60;
    }
    
    secondsRemaining = totalSeconds;
    updateDisplay();
}

/**
 * Mereset timer kembali ke mode Fokus awal.
 */
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isFocusMode = true;
    sessionsCompleted = 0;
    sessionsDisplay.textContent = '0';
    
    // Setel ulang tampilan dan tombol
    setupTimer(); // Panggil ini untuk setel ulang waktu ke nilai input
    startPauseButton.textContent = 'Mulai';
    modeLabel.textContent = 'Fokus';
    modeLabel.style.color = '#FFB3C0'; 
    statusDisplay.textContent = 'Berhenti';
    document.title = 'Pomodoro Timer';
}

/**
 * Melompati sesi saat ini.
 */
function skipSession() {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Ganti mode (Fokus -> Istirahat, atau sebaliknya)
    toggleMode();
    
    // Reset tombol
    startPauseButton.textContent = 'Mulai';
    statusDisplay.textContent = 'Berhenti';
}

// =======================================
// 3. Pengingat dan Setup Awal
// =======================================

/**
 * Fungsi Pengingat: Memutar suara notifikasi.
 * CATATAN: Anda perlu menyediakan file audio (misalnya 'bell.mp3')
 */
function playNotificationSound() {
    // Ganti 'bell.mp3' dengan path file suara yang Anda miliki
    // Untuk pengembangan awal, Anda bisa menggunakan suara dari luar:
    // const sound = new Audio('https://www.soundjay.com/misc/bell-ringing-01.mp3'); 
    // sound.play().catch(e => console.error("Gagal memutar suara:", e));
    
    // Atau buat notifikasi sederhana di browser jika suara tidak tersedia:
    alert(`${isFocusMode ? 'ISTIRAHAT' : 'FOKUS'}! Waktu sesi telah habis.`);
}

/**
 * Menyiapkan event listeners saat dokumen dimuat.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Pasang fungsi ke tombol
    startPauseButton.addEventListener('click', startPauseTimer);
    resetButton.addEventListener('click', resetTimer);
    skipButton.addEventListener('click', skipSession);
    
    // Pasang fungsi untuk mengupdate waktu saat input berubah
    focusTimeInput.addEventListener('change', setupTimer);
    breakTimeInput.addEventListener('change', setupTimer);
    
    // Inisialisasi tampilan waktu awal
    setupTimer();
});
