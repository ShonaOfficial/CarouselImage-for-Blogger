/* ShopSKW Carousel Engine
   Konfigurasi dibaca dari HTML: window.SHOPSKW_CONFIG = { ACTIVE_STYLE: 1, AUTOPLAY: true, INTERVAL: 4000 } */
(function () {
  const cfg = Object.assign({ ACTIVE_STYLE: 1, AUTOPLAY: true, INTERVAL: 4000 }, window.SHOPSKW_CONFIG || {});
  const total = 4;
  let currentStyle = cfg.ACTIVE_STYLE, currentIndex = 0, isAutoPlay = false, timer;

  const TAB_ON = "py-2 px-2.5 rounded-2xl text-[11px] font-bold transition flex items-center justify-center gap-1 bg-purple-600 text-white shadow-md shadow-purple-500/25";
  const TAB_OFF = "py-2 px-2.5 rounded-2xl text-[11px] font-bold transition flex items-center justify-center gap-1 glass-panel text-gray-700 hover:bg-white";
  const VP = "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ";
  const VP_ON = VP + "bg-purple-600 text-white shadow-sm", VP_OFF = VP + "text-gray-600 hover:text-purple-700";

  const descriptions = {
    1: { title: "Gaya 1: 3D Stacked Depth Peek-Behind" },
    2: { title: "Gaya 2: 3D Coverflow Flow" },
    3: { title: "Gaya 3: Floating Glow Cards" },
    4: { title: "Gaya 4: Minimalist Split Stack" }
  };

  // state class per jarak slide dari index aktif (selain itu = hidden-card)
  const STATES = {
    1: { 0: "active", 1: "next-1", 2: "next-2" },
    2: { 0: "active", 1: "right-peek", 3: "left-peek" },
    3: { 0: "active", 1: "next-1", 2: "next-2" },
    4: { 0: "active", 1: "next-1", 2: "next-2" }
  };
  const ALL = ["active", "next-1", "next-2", "left-peek", "right-peek", "hidden-card"];

  // [gradient, iconClass, iconColor, badge, textColor, title, desc]
  const SLIDES = {
    1: [
      ["from-violet-900 via-purple-900 to-indigo-900","fa-bolt","text-amber-300","Mega Sale #1","purple","Gadget Flagship Terbaru","Nikmati performa luar biasa dengan cashback spesial hari ini."],
      ["from-indigo-900 via-blue-900 to-slate-900","fa-clock","text-blue-300","Antrean #1","blue","Elektronik Smart Home","Ubah rumah Anda jadi lebih modern dan otomatis."],
      ["from-fuchsia-900 via-pink-900 to-rose-900","fa-clock","text-pink-300","Antrean #2","pink","Fashion Gaya Hidup","Temukan OOTD tren terbaru musim ini."],
      ["from-slate-900 via-purple-950 to-zinc-900","fa-clock","text-yellow-300","Antrean #3","gray","Properti Eksklusif","Hunian strategis bebas banjir."]
    ],
    2: [
      ["from-cyan-900 via-blue-900 to-indigo-900","fa-film","text-cyan-300","Coverflow Utama","cyan","Gaming Rig Ultimate","Performa monster untuk pengalaman gaming tanpa batas."],
      ["from-emerald-900 via-teal-900 to-slate-900","fa-arrow-right","text-emerald-300","Intipan Kanan","emerald","Audio & Headset Pro","Suara jernih berteknologi spatial audio."],
      ["from-amber-900 via-orange-900 to-red-900","fa-tag","text-amber-300","Koleksi #3","amber","Aksesoris Kamera","Abadikan momen berharga dengan lensa premium."],
      ["from-purple-900 via-pink-900 to-rose-900","fa-arrow-left","text-pink-300","Intipan Kiri","pink","Kendaraan Listrik","Ramah lingkungan dan hemat energi."]
    ],
    3: [
      ["from-rose-950 via-purple-950 to-indigo-950","fa-fire","text-pink-400","Glowing Utama","pink","Koleksi Fashion Eksklusif","Tampil elegan dengan desain modern terbaik."],
      ["from-blue-950 via-slate-900 to-indigo-950","fa-clock","text-blue-300","Antrean #1","blue","Smartwatch & Wearable","Pantau kebugaran setiap hari."],
      ["from-emerald-950 via-teal-950 to-slate-950","fa-clock","text-emerald-300","Antrean #2","emerald","Dekorasi Minimalis","Percantik sudut ruangan."],
      ["from-amber-950 via-orange-950 to-zinc-950","fa-clock","text-yellow-300","Antrean #3","amber","Kuliner Nusantara","Nikmati kelezatan praktis."]
    ],
    4: [
      ["from-slate-900 via-purple-950 to-indigo-900","fa-layer-group","text-purple-300","Minimalist Utama","purple","Eksklusif VIP Member","Cashback ekstra 50% setiap transaksi."],
      ["from-zinc-900 via-blue-950 to-slate-900","fa-clock","text-blue-300","Antrean #1","blue","Kamera Mirrorless 8K","Abadikan momen sinematik."],
      ["from-neutral-900 via-pink-950 to-rose-900","fa-clock","text-pink-300","Antrean #2","pink","Sneakers Limited Edition","Original import tren streetwear."],
      ["from-stone-900 via-indigo-950 to-zinc-900","fa-clock","text-yellow-300","Antrean #3","gray","Skincare Organik","Perawatan kulit aman BPOM."]
    ]
  };
  // kelas warna teks eksplisit agar terdeteksi Tailwind
  const TXT = { purple:["text-purple-200"], blue:["text-blue-200"], pink:["text-pink-200"], gray:["text-gray-300"], cyan:["text-cyan-200"], emerald:["text-emerald-200"], amber:["text-amber-200"] };

  function buildCards() {
    for (let s = 1; s <= 4; s++) {
      const host = document.getElementById("cards" + s);
      host.innerHTML = SLIDES[s].map((d, i) => `
        <div class="s${s}-card hidden-card bg-gradient-to-r ${d[0]} flex flex-col justify-between p-5 text-white" onclick="nextSlide()">
          <div class="absolute inset-0 card-shine pointer-events-none"></div>
          <div class="relative z-10 flex justify-between items-start">
            <span class="bg-white/20 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              <i class="fa-solid ${d[1]} ${d[2]} mr-1"></i> ${d[3]}</span>
            <span class="text-[10px] ${TXT[d[4]][0]} bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg font-mono">0${i + 1} / 04</span>
          </div>
          <div class="relative z-10 mt-auto">
            <h3 class="text-lg font-extrabold tracking-tight">${d[5]}</h3>
            <p class="${TXT[d[4]][0]} text-xs mt-1 font-light line-clamp-1">${d[6]}</p>
            ${s === 1 && i === 0 ? '<span class="inline-block mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-xl shadow-md">Klaim Voucher</span>' : ""}
          </div>
        </div>`).join("");
    }
  }

  function updateCarouselState() {
    document.querySelectorAll(`#cards${currentStyle} .s${currentStyle}-card`).forEach((card, idx) => {
      const dist = (idx - currentIndex + total) % total;
      card.classList.remove(...ALL);
      card.classList.add(STATES[currentStyle][dist] || "hidden-card");
    });
    document.querySelectorAll(".indicator-dot").forEach((dot, idx) => {
      const on = idx === currentIndex;
      dot.classList.toggle("w-6", on); dot.classList.toggle("bg-purple-700", on);
      dot.classList.toggle("w-2", !on); dot.classList.toggle("bg-purple-300", !on);
    });
  }

  window.setViewport = function (mode) {
    const d = mode === "desktop";
    document.getElementById("viewportWrapper").classList.toggle("desktop-mode", d);
    document.getElementById("btnDesk").className = d ? VP_ON : VP_OFF;
    document.getElementById("btnSmart").className = d ? VP_OFF : VP_ON;
  };

  window.switchStyle = function (n) {
    currentStyle = n; currentIndex = 0;
    for (let i = 1; i <= 4; i++) {
      document.getElementById("stageContainer" + i).classList.add("hidden");
      document.getElementById("styleTab" + i).className = TAB_OFF;
    }
    document.getElementById("stageContainer" + n).classList.remove("hidden");
    document.getElementById("styleTab" + n).className = TAB_ON;
    document.getElementById("descTitle").innerText = descriptions[n].title;
    updateCarouselState(); resetTimer();
  };

  window.nextSlide = function () { currentIndex = (currentIndex + 1) % total; updateCarouselState(); resetTimer(); };
  window.prevSlide = function () { currentIndex = (currentIndex - 1 + total) % total; updateCarouselState(); resetTimer(); };
  window.goToSlide = function (i) { currentIndex = i; updateCarouselState(); resetTimer(); };

  function startAutoPlay() {
    clearInterval(timer);
    timer = setInterval(() => { currentIndex = (currentIndex + 1) % total; updateCarouselState(); }, cfg.INTERVAL);
    isAutoPlay = true;
    document.getElementById("playPauseBtn").innerHTML = '<i class="fa-solid fa-pause mr-1 text-[10px]"></i> Pause';
  }
  function stopAutoPlay() {
    clearInterval(timer); isAutoPlay = false;
    document.getElementById("playPauseBtn").innerHTML = '<i class="fa-solid fa-play mr-1 text-[10px]"></i> Play';
  }
  window.toggleAutoPlay = function () { isAutoPlay ? stopAutoPlay() : startAutoPlay(); };
  function resetTimer() { if (isAutoPlay) startAutoPlay(); }

  buildCards();
  switchStyle(currentStyle);
  cfg.AUTOPLAY ? startAutoPlay() : stopAutoPlay();
})();
