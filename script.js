// ==========================================
// ⚙️ KONFIGURASI MUDAH (Ganti nomor WA di sini ya!)
// ==========================================
const CONFIG = {
  crushName: "Kamu",
  whatsappNumber: "", // Masukkan nomor WhatsApp kamu dengan format internasional (contoh: "6281234567890")
  customWAMessage: "Halo! Aku udah baca webnya... dan jawabannya YES! ❤️"
};

// ==========================================
// Inisialisasi Nama & Link WhatsApp
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Pasang link WhatsApp
  const waBtn = document.getElementById("waButton");
  if (CONFIG.whatsappNumber) {
    const encodedMsg = encodeURIComponent(CONFIG.customWAMessage);
    waBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;
  } else {
    waBtn.href = `https://wa.me/?text=${encodeURIComponent(CONFIG.customWAMessage)}`;
  }

  // Generate floating hearts
  createFloatingHearts();
});

// ==========================================
// Navigasi Kartu (Next)
// ==========================================
function goToCard(cardNumber) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.remove("active"));

  const targetCard = document.getElementById(`card-${cardNumber}`);
  if (targetCard) {
    targetCard.classList.add("active");
  }

  // Jika masuk ke Card 12 (Confession), siapkan tombol Yes & No
  if (cardNumber === 12) {
    resetConfessionState();
  }
}

function nextCard(targetNumber) {
  goToCard(targetNumber);
}

// ==========================================
// Checkpoint Card Logic (Card 11)
// ==========================================
let checkpointTeaseIndex = 0;
const checkpointTeaseMessages = [
  "Yakin nih gak mau lanjut? Tanggung loh...",
  "Dih jahat banget haha, coba klik yang lanjut dong!",
  "Masa gak penasaran sama kelanjutannya?",
  "Gak bisa nolak pokoknya, wajib klik lanjut ya! ❤️"
];

function teaseCheckpointNo() {
  const hintEl = document.getElementById("checkpointHint");
  hintEl.textContent = checkpointTeaseMessages[checkpointTeaseIndex % checkpointTeaseMessages.length];
  checkpointTeaseIndex++;

  // Efek getar tombol
  const noBtn = document.getElementById("checkpointNoBtn");
  noBtn.style.transform = "translateX(8px)";
  setTimeout(() => { noBtn.style.transform = "translateX(-8px)"; }, 80);
  setTimeout(() => { noBtn.style.transform = "translateX(5px)"; }, 160);
  setTimeout(() => { noBtn.style.transform = "translateX(0)"; }, 240);
}

// ==========================================
// Logika Tombol di Card 12:
// - Bisa diklik maksimal 5 KALI
// - Klik 1 s/d 4: "No" pindah acak di layar & makin mengecil, "Yes" makin besar
// - Klik ke-5: "No" HILANG TOTAL!
// ==========================================
let clickCount = 0;
const dodgeMessages = [
  "Eits, tombolnya kabur dan makin kecil kan? 😜",             // Klik 1
  "Tuh makin mini tombol 'No'-nya!",                           // Klik 2
  "Udah deh, klik yang 'Yes' aja wkwk! 😂",                    // Klik 3
  "Tombolnya udah super kecil! Sekali lagi bakal hilang loh..." // Klik 4
];

function resetConfessionState() {
  clickCount = 0;
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const counterText = document.getElementById("dodgeCounterText");
  const zone = document.getElementById("confessionButtonsZone");

  if (noBtn) {
    // Kembalikan ke dalam zone jika sebelumnya dipindah ke body
    if (zone && noBtn.parentElement !== zone) {
      zone.appendChild(noBtn);
    }
    noBtn.style.position = "";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.transform = "scale(1)";
    noBtn.style.opacity = "1";
    noBtn.style.pointerEvents = "auto";
    noBtn.style.display = "inline-flex";
  }
  if (yesBtn) {
    yesBtn.style.transform = "scale(1)";
  }
  if (counterText) {
    counterText.textContent = "";
  }
}

function onNoButtonClick(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  clickCount++;
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const counterText = document.getElementById("dodgeCounterText");

  // Pindahkan tombol No ke body agar posisi fixed benar-benar mengikuti layar HP/browser
  // (mencegah tombol terlempar keluar layar karena transform milik kartu)
  if (noBtn.parentElement !== document.body) {
    document.body.appendChild(noBtn);
  }

  // ==========================================
  // JIKA SUDAH KLIK KE-5 (MAKSIMAL 5 KALI): HILANG!
  // ==========================================
  if (clickCount >= 5) {
    noBtn.style.transform = "scale(0)";
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    setTimeout(() => {
      noBtn.style.display = "none";
    }, 250);

    // Tombol Yes membesar maksimal
    yesBtn.style.transform = "scale(2.2)";

    if (counterText) {
      counterText.textContent = "Tuh kan tombol 'No'-nya udah nyerah dan hilang! Sekarang tinggal klik Yes yaa 🥰";
    }
    return;
  }

  // ==========================================
  // KLIK 1 SAMPAI 4: PINDAH DI AREA LAYAR YANG TERLIHAT
  // ==========================================
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const btnW = noBtn.offsetWidth || 85;
  const btnH = noBtn.offsetHeight || 42;

  // Batas aman dalam layar HP:
  // Jaga jarak dari atas 90px (agar tidak tertutup tombol musik)
  // Jaga jarak dari bawah 60px (agar tidak keluar dari layar)
  const minX = 20;
  const maxX = Math.max(minX, vw - btnW - 20);
  const minY = 90;
  const maxY = Math.max(minY, vh - btnH - 70);

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  const randomRot = Math.floor(Math.random() * 24) - 12;

  // 1. Tombol 'No' MAKIN KECIL (Klik 1: 0.85, Klik 2: 0.70, Klik 3: 0.55, Klik 4: 0.42)
  const currentNoScale = Math.max(0.40, 1 - (clickCount * 0.15));

  // 2. Tombol 'Yes' MAKIN BESAR
  const currentYesScale = Math.min(2.1, 1 + (clickCount * 0.22));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.zIndex = "999999";
  noBtn.style.transform = `scale(${currentNoScale}) rotate(${randomRot}deg)`;

  // Perbesar tombol Yes
  yesBtn.style.transform = `scale(${currentYesScale})`;

  // Update teks ledekan
  if (counterText) {
    counterText.textContent = dodgeMessages[clickCount - 1] || "";
  }
}

// ==========================================
// Aksi Ketika Klik "Yes" (Diterima)
// ==========================================
function acceptConfession() {
  // Sembunyikan tombol No jika ada
  const noBtn = document.getElementById("noBtn");
  if (noBtn) {
    noBtn.style.display = "none";
  }

  // Pindah ke kartu selebrasi (Card 13)
  goToCard(13);

  // Ledakkan Confetti!
  triggerCelebrationConfetti();
}

function triggerCelebrationConfetti() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Dua semburan dari kiri dan kanan
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    }));
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    }));
  }, 250);
}

// ==========================================
// Background Floating Hearts Generator
// ==========================================
function createFloatingHearts() {
  const heartsContainer = document.getElementById("heartsBg");
  if (!heartsContainer) return;

  const heartIcons = ["❤️", "💖", "💕", "🌸", "✨", "💗"];
  const totalHearts = 14;

  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.style.left = `${Math.random() * 100}%`;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 8;
    const size = 1 + Math.random() * 1.5;

    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.fontSize = `${size}rem`;

    heartsContainer.appendChild(heart);
  }
}

// ==========================================
// Musik Latar (Play / Pause Toggle)
// ==========================================
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggle.classList.add("playing");
      }).catch(err => {
        console.log("Audio autoplay prevented:", err);
      });
    } else {
      bgMusic.pause();
      musicToggle.classList.remove("playing");
    }
  });
}
