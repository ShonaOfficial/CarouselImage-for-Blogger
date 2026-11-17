// =========================================================
// PENGATURAN UTAMA: PILIH GAYA CAROUSEL YANG AKTIF
// 1 = 3D Stacked Depth
// 2 = 3D Coverflow Flow
// 3 = Floating Glow Cards
// 4 = Minimalist Split Stack
// Ubah angka ACTIVE_STYLE untuk mengganti gaya default.
// =========================================================
const ACTIVE_STYLE = 1;

let currentStyle = ACTIVE_STYLE;
let currentIndex = 0;
const totalSlides = 4;
let isAutoPlay = false;
let autoPlayTimer;

const descriptions = {
    1: { title: "Gaya 1: 3D Stacked Depth Peek-Behind", desc: "Kartu antrean miring bertumpuk rapi di belakang dengan efek depth yang memukau." },
    2: { title: "Gaya 2: 3D Coverflow Flow", desc: "Intipan gambar tersusun di sisi kiri dan kanan dengan perspektif 3D melengkung." },
    3: { title: "Gaya 3: Floating Glow Cards", desc: "Desain kartu mengambang dengan efek glow dinamis di sekeliling sudut kartu." },
    4: { title: "Gaya 4: Minimalist Split Stack", desc: "Tata letak bertumpuk vertikal bersih dengan transisi geser modern." }
};

function setViewport(mode) {
    const wrapper = document.getElementById('viewportWrapper');
    const btnSmart = document.getElementById('btnSmart');
    const btnDesk = document.getElementById('btnDesk');

    if (mode === 'desktop') {
        wrapper.classList.add('desktop-mode');
        btnDesk.className = "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-purple-600 text-white shadow-sm";
        btnSmart.className = "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-gray-600 hover:text-purple-700";
    } else {
        wrapper.classList.remove('desktop-mode');
        btnSmart.className = "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-purple-600 text-white shadow-sm";
        btnDesk.className = "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-gray-600 hover:text-purple-700";
    }
}

function switchStyle(styleNum) {
    currentStyle = styleNum;
    currentIndex = 0;

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`stageContainer${i}`).classList.add('hidden');
        const tab = document.getElementById(`styleTab${i}`);
        tab.className = "py-2 px-2.5 rounded-2xl text-[11px] font-bold transition flex items-center justify-center gap-1 glass-panel text-gray-700 hover:bg-white";
    }

    document.getElementById(`stageContainer${styleNum}`).classList.remove('hidden');
    const activeTab = document.getElementById(`styleTab${styleNum}`);
    activeTab.className = "py-2 px-2.5 rounded-2xl text-[11px] font-bold transition flex items-center justify-center gap-1 bg-purple-600 text-white shadow-md shadow-purple-500/25";

    document.getElementById('descTitle').innerText = descriptions[styleNum].title;
    updateCarouselState();
    resetTimer();
}

function updateCarouselState() {
    if (currentStyle === 1) {
        const cards = document.querySelectorAll('#stack1 .s1-card');
        cards.forEach((card, idx) => {
            let distance = (idx - currentIndex + totalSlides) % totalSlides;
            card.classList.remove('active', 'next-1', 'next-2', 'hidden-card');
            if (distance === 0) card.classList.add('active');
            else if (distance === 1) card.classList.add('next-1');
            else if (distance === 2) card.classList.add('next-2');
            else card.classList.add('hidden-card');
        });
    } else if (currentStyle === 2) {
        const cards = document.querySelectorAll('#stage2 .s2-card');
        cards.forEach((card, idx) => {
            let distance = (idx - currentIndex + totalSlides) % totalSlides;
            card.classList.remove('active', 'left-peek', 'right-peek', 'hidden-card');
            if (distance === 0) card.classList.add('active');
            else if (distance === 1) card.classList.add('right-peek');
            else if (distance === 3) card.classList.add('left-peek');
            else card.classList.add('hidden-card');
        });
    } else if (currentStyle === 3) {
        const cards = document.querySelectorAll('#stack3 .s3-card');
        cards.forEach((card, idx) => {
            let distance = (idx - currentIndex + totalSlides) % totalSlides;
            card.classList.remove('active', 'next-1', 'next-2', 'hidden-card');
            if (distance === 0) card.classList.add('active');
            else if (distance === 1) card.classList.add('next-1');
            else if (distance === 2) card.classList.add('next-2');
            else card.classList.add('hidden-card');
        });
    } else if (currentStyle === 4) {
        const cards = document.querySelectorAll('#stack4 .s4-card');
        cards.forEach((card, idx) => {
            let distance = (idx - currentIndex + totalSlides) % totalSlides;
            card.classList.remove('active', 'next-1', 'next-2', 'hidden-card');
            if (distance === 0) card.classList.add('active');
            else if (distance === 1) card.classList.add('next-1');
            else if (distance === 2) card.classList.add('next-2');
            else card.classList.add('hidden-card');
        });
    }

    // Update persistent dots
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
            dot.classList.remove('w-2', 'bg-purple-300');
            dot.classList.add('w-6', 'bg-purple-700');
        } else {
            dot.classList.remove('w-6', 'bg-purple-700');
            dot.classList.add('w-2', 'bg-purple-300');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarouselState();
    resetTimer();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarouselState();
    resetTimer();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarouselState();
    resetTimer();
}

function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarouselState();
    }, 4000);
    isAutoPlay = true;
    document.getElementById('playPauseBtn').innerHTML = '<i class="fa-solid fa-pause mr-1 text-[10px]"></i> Pause';
}

function stopAutoPlay() {
    clearInterval(autoPlayTimer);
    isAutoPlay = false;
    document.getElementById('playPauseBtn').innerHTML = '<i class="fa-solid fa-play mr-1 text-[10px]"></i> Play';
}

function toggleAutoPlay() {
    if (isAutoPlay) stopAutoPlay();
    else startAutoPlay();
}

function resetTimer() {
    if (isAutoPlay) {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }
}

// Initialize on load menggunakan gaya dari ACTIVE_STYLE
switchStyle(ACTIVE_STYLE);
startAutoPlay();
