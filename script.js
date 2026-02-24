// --- PLAYLIST ---
const playlist = [
    { title: "1. I Don't Want To Sleep", file: "imgs/song1.mp3", cover: "imgs/musicplayer.jpg" },
    { title: "2. Chill Vibes",           file: "imgs/song2.mp3", cover: "imgs/cover1.jpg"      },
    { title: "3. Fantasy World",         file: "imgs/song3.mp3", cover: "imgs/cover2.jpg"      },
    { title: "4. Cool Mood",             file: "imgs/song4.mp3", cover: "imgs/cover3.jpg"      },
    { title: "5. Lo-Fi Study",           file: "imgs/song5.mp3", cover: "imgs/cover4.jpg"      }
];

let currentTrackIndex = 0;
let zIndexCounter = 100;

// --- UTILITIES ---

function playSound(file) {
    const a = new Audio(file);
    a.volume = 0.4;
    a.play();
}

function updateClock() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const clock = document.getElementById('clock');
    const date  = document.getElementById('date');
    if (clock) clock.innerText = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    if (date)  date.innerText  = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
}

function bringToFront(el) {
    el.style.zIndex = ++zIndexCounter;
}

// --- WINDOW MANAGEMENT ---

function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('closing');
    setTimeout(() => { win.style.display = 'none'; win.classList.remove('closing'); }, 300);
}

function openWindow(id) {
    const target = document.getElementById(id);
    document.querySelectorAll('.window').forEach(win => {
        if (win.style.display !== 'none' && win.id !== id && win.id !== 'window-home') {
            win.classList.add('closing');
            setTimeout(() => { win.style.display = 'none'; win.classList.remove('closing'); }, 300);
        }
    });
    setTimeout(() => {
        if (target) { target.classList.remove('closing'); target.style.display = 'flex'; bringToFront(target); }
    }, 300);
}

// --- TABS ---

function switchTab(btn, contentId) {
    document.querySelectorAll('.tab-vertical-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.content-box').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(contentId)?.classList.add('active');
}

function switchWorkTab(btn, sectionId) {
    document.querySelectorAll('.work-tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.work-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(sectionId)?.classList.add('active');
}

// --- MUSIC PLAYER ---

function loadTrack(index) {
    currentTrackIndex = index;
    const audio   = document.getElementById('audio-player');
    const cover   = document.getElementById('current-cover');
    const title   = document.getElementById('track-title');
    const playBtn = document.getElementById('play-btn');
    const vinyl   = document.querySelector('.vinyl-disc');
    if (!audio) return;

    const track = playlist[index];
    audio.src = track.file;
    if (cover)   cover.src        = track.cover;
    if (title)   title.innerText  = track.title;
    if (playBtn) playBtn.innerText = "▶";
    if (vinyl)   vinyl.style.animationPlayState = "paused";

    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function togglePlay() {
    const audio   = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const vinyl   = document.querySelector('.vinyl-disc');
    if (audio.paused) {
        audio.play();
        if (playBtn) playBtn.innerText = "⏸";
        if (vinyl)   vinyl.style.animationPlayState = "running";
    } else {
        audio.pause();
        if (playBtn) playBtn.innerText = "▶";
        if (vinyl)   vinyl.style.animationPlayState = "paused";
    }
}

function playTrack(index) {
    loadTrack(index);
    setTimeout(togglePlay, 100);
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

function seekAudio() {
    const audio = document.getElementById('audio-player');
    const bar   = document.getElementById('progress-bar');
    if (audio && bar) audio.currentTime = bar.value;
}

function setVolume(val) {
    const audio = document.getElementById('audio-player');
    if (audio) audio.volume = val;
}

// --- CONTACT FORM ---

function sendEmail() {
    const email = atob("anVsaWEudnNvdXphNTVAZ21haWwuY29t");
    const name    = document.getElementById('contact-name').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    if (!message) { alert("Please, Write Something To Send! ✍️"); return; }
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject || "Portfolio Contacting")}&body=${encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`)}`);
}

function saveDraft() {
    if (!confirm("Do You Wish to Download This Draft? 📄")) return;
    const name    = document.getElementById('contact-name').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    const blob    = new Blob([`From: ${name}\nSubject: ${subject}\n\n${message}`], { type: "text/plain" });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: "Email_Draft.txt" });
    a.click();
    alert("Saved Draft! 💾");
}

function toggleImportant() {
    const subject = document.getElementById('contact-subject');
    const message = document.getElementById('contact-message');
    const prefix  = "❗ Important: ";
    if (subject.value.startsWith(prefix)) {
        subject.value = subject.value.replace(prefix, "");
        message.style.cssText = "";
    } else {
        subject.value = prefix + subject.value;
        message.style.cssText = "color:#d00;font-weight:bold";
    }
}

function clearForm() {
    if (!confirm("Delete Everything? 🗑️")) return;
    ['contact-name', 'contact-subject', 'contact-message'].forEach(id => document.getElementById(id).value = "");
    document.getElementById('contact-message').style.cssText = "";
}

// --- LIGHTBOX ---

function openLightbox(src, caption) {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    lb.style.display  = "flex";
    img.src           = src;
    cap.innerText     = caption || "";
    cap.style.display = caption ? "block" : "none";
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

// --- START MENU ---

function toggleMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// --- FAQ ---

function toggleFAQ(el) {
    document.querySelectorAll('.faq-item').forEach(item => { if (item !== el) item.classList.remove('active'); });
    el.classList.toggle('active');
}

// --- DRAG & DROP ---

function makeDraggable(el) {
    let ox = 0, oy = 0, mx = 0, my = 0;
    const handle = el.querySelector('.title-bar') || el;
    handle.onmousedown = e => {
        if (['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName)) return;
        if (window.innerWidth <= 850) return;
        e.preventDefault();
        mx = e.clientX; my = e.clientY;
        document.onmousemove = e => {
            if (window.innerWidth <= 850) return;
            ox = mx - e.clientX; oy = my - e.clientY;
            mx = e.clientX;      my = e.clientY;
            el.style.top  = Math.max(0, el.offsetTop  - oy) + "px";
            el.style.left = Math.max(0, el.offsetLeft - ox) + "px";
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}

// --- INIT ---

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    loadTrack(0);

    // Player events
    const audio = document.getElementById('audio-player');
    const bar   = document.getElementById('progress-bar');
    if (audio) {
        audio.addEventListener('timeupdate', () => {
            if (document.activeElement !== bar) { bar.max = audio.duration; bar.value = audio.currentTime; }
        });
        audio.addEventListener('ended', nextTrack);
    }

    // Drag + bring-to-front
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
        win.addEventListener('mousedown', () => bringToFront(win));
    });

    // Gallery lightbox
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            const caption = img.nextElementSibling?.innerText || "";
            openLightbox(img.src, caption);
        });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
        const menu = document.getElementById('start-menu');
        const btn  = document.querySelector('.start-btn');
        if (!menu.contains(e.target) && e.target !== btn) menu.style.display = 'none';
    });

    // Close lightbox on ESC
    document.addEventListener('keydown', e => { if (e.key === "Escape") closeLightbox(); });
});
