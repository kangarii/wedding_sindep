// ────────────────────────────────────────────────
// 1. Utility: get URL param
// ────────────────────────────────────────────────
function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// ────────────────────────────────────────────────
// 2. Guest name from ?to=...
// ────────────────────────────────────────────────
const guestName = getParam("to");

if (guestName) {
  // Cover
  const cgBlock = document.getElementById("cover-guest");
  const cgName = document.getElementById("cover-guest-name");
  cgBlock.classList.remove("hidden");
  cgName.textContent = guestName;

  // Hero
  document.getElementById("hero-guest-name").textContent = guestName;
}

// ────────────────────────────────────────────────
// 3. Open invitation (dismiss cover)
// ────────────────────────────────────────────────
function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("main-content");

  cover.classList.add("hidden-cover");
  main.style.opacity = "1";

  // Reinit AOS after reveal
  setTimeout(() => AOS.refresh(), 100);
}

// ────────────────────────────────────────────────
// 4. Countdown timer
// ────────────────────────────────────────────────
function setTextIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value).padStart(2, "0");
}

function setHTMLIfExists(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function updateCountdown() {
  const target = new Date();
  target.setFullYear(2026);
  target.setMonth(5); // Juni
  target.setDate(6);
  target.setHours(8);
  target.setMinutes(0);
  target.setSeconds(0);
  const now = new Date();

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent = days;
  document.getElementById("cd-hours").textContent = hours;
  document.getElementById("cd-mins").textContent = mins;
  document.getElementById("cd-secs").textContent = secs;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ────────────────────────────────────────────────
// 5. Carousel
// ────────────────────────────────────────────────
(function () {
  const track = document.getElementById("carousel-track");
  const dotsEl = document.getElementById("carousel-dots");
  const slides = track.querySelectorAll(".carousel-slide");
  const total = slides.length;
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.onclick = () => goTo(i);
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  window.carouselNext = () => goTo(current + 1);
  window.carouselPrev = () => goTo(current - 1);

  resetAuto();
})();

// ────────────────────────────────────────────────
// 6. RSVP form validation & direct WhatsApp
// ────────────────────────────────────────────────
function submitRSVP(e) {
  e.preventDefault();
  let valid = true;

  // GANTI NOMOR DI BAWAH INI dengan nomor WhatsApp penerima RSVP.
  // Format wajib: kode negara + nomor, tanpa tanda +, spasi, atau strip.
  // Contoh: 6281234567890
  const whatsappNumber = "6287888584089";

  const nama = document.getElementById("rsvp-nama").value.trim();
  const jumlah = document.getElementById("rsvp-jumlah").value.trim();
  const hadir = document.querySelector('input[name="hadir"]:checked');
  const pesan = document.getElementById("rsvp-pesan").value.trim();
  const statusKehadiran = hadir
    ? hadir.value === "hadir"
      ? "Hadir"
      : "Tidak Hadir"
    : "";

  // Reset errors
  ["nama", "jumlah", "hadir"].forEach((id) => {
    document.getElementById("err-" + id).classList.add("hidden");
  });

  if (!nama) {
    document.getElementById("err-nama").classList.remove("hidden");
    valid = false;
  }
  if (!jumlah) {
    document.getElementById("err-jumlah").classList.remove("hidden");
    valid = false;
  }
  if (!hadir) {
    document.getElementById("err-hadir").classList.remove("hidden");
    valid = false;
  }

  if (!valid) return;

  const templateChat = `Assalamu'alaikum, saya ingin konfirmasi kehadiran untuk undangan pernikahan Depi & Sintiya.

Nama: ${nama}
Jumlah Tamu: ${jumlah}
Kehadiran: ${statusKehadiran}
Pesan/Doa: ${pesan || "-"}

Terima kasih.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(templateChat)}`;
  window.open(whatsappUrl, "_blank");

  document.getElementById("rsvp-form").classList.add("hidden");
  document.getElementById("rsvp-success").classList.remove("hidden");
}

// ────────────────────────────────────────────────
// 7. Copy wedding gift number
// ────────────────────────────────────────────────
function copyText(elementId, button) {
  const text = document.getElementById(elementId).textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const oldText = button.textContent;
    button.textContent = "Tersalin";
    setTimeout(() => (button.textContent = oldText), 1500);
  });
}

// ────────────────────────────────────────────────
// 8. AOS Init
// ────────────────────────────────────────────────
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
});

// Disable right click
// document.addEventListener("contextmenu", function (e) {
//   e.preventDefault();
// });

// 9. Disable DevTools shortcuts
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();
    return false;
  }
});

// Detect DevTools open
setInterval(function () {
  const threshold = 160;
  if (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  ) {
    document.body.innerHTML = `
            <div style="
              display:flex;
              align-items:center;
              justify-content:center;
              height:100vh;
              font-family:sans-serif;
              background:#eef7ff;
              color:#12355B;
              text-align:center;
              padding:20px;
            ">
              <div>
                <h1 style="font-size:32px;margin-bottom:12px;">Akses Ditolak</h1>
                <p>Developer tools terdeteksi.</p>
              </div>
            </div>
          `;
  }
}, 1000);
history.scrollRestoration = "manual";
// Refresh Mode
window.addEventListener("load", () => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
});

// 10. Bacsound Music
let isMusicPlaying = false;

function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("main-content");

  cover.classList.add("hidden-cover");
  main.style.opacity = "1";

  playMusic();

  setTimeout(() => AOS.refresh(), 100);
}

function playMusic() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");

  music
    .play()
    .then(() => {
      isMusicPlaying = true;
      btn.classList.add("playing");
    })
    .catch(() => {
      isMusicPlaying = false;
      btn.classList.remove("playing");
    });
}

function pauseMusic() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");

  music.pause();
  isMusicPlaying = false;
  btn.classList.remove("playing");
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}
