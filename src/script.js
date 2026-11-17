/* ShopSKW Carousel Engine v0.1.0
   Membaca slide dari widget carousel template (.sldW > input[type=radio] + .sldA).
   Konfigurasi dari HTML: window.SHOPSKW_CONFIG = { ACTIVE_STYLE: 1, AUTOPLAY: true, INTERVAL: 4000 }
   ACTIVE_STYLE: 1 Stacked | 2 Coverflow | 3 Floating Glow | 4 Minimalist */
(function () {
  "use strict";
  if (document.body && document.body.id === "layout") return; // jangan jalan di editor Tata Letak Blogger

  var cfg = Object.assign({ ACTIVE_STYLE: 1, AUTOPLAY: true, INTERVAL: 4000, PAUSE_ON_HOVER: true }, window.SHOPSKW_CONFIG || {});
  var style = Math.min(4, Math.max(1, parseInt(cfg.ACTIVE_STYLE, 10) || 1));
  var interval = Math.max(1500, parseInt(cfg.INTERVAL, 10) || 4000);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  var ALL = ["active", "next-1", "next-2", "left-peek", "right-peek", "hidden-card"];

  function init(w) {
    var inputs = [].slice.call(w.querySelectorAll(":scope > input[type=radio]"));
    var cards = [].slice.call(w.querySelectorAll(".sldA"));
    var n = Math.min(inputs.length, cards.length);
    if (n < 1) return;

    var timer = null, hover = false;

    function current() {
      for (var i = 0; i < n; i++) if (inputs[i].checked) return i;
      return 0;
    }
    function stateOf(d) {
      if (d === 0) return "active";
      if (style === 2) return d === 1 ? "right-peek" : d === n - 1 ? "left-peek" : "hidden-card";
      return d === 1 ? "next-1" : d === 2 ? "next-2" : "hidden-card";
    }
    function render() {
      var idx = current();
      cards.forEach(function (c, i) {
        c.classList.remove.apply(c.classList, ALL);
        c.classList.add(stateOf((i - idx + n) % n));
      });
    }
    function go(i) {
      inputs[(i + n) % n].checked = true;
      render();
      restart();
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      stop();
      if (n < 2 || !cfg.AUTOPLAY || reduce || hover || document.hidden) return;
      timer = setInterval(function () { go(current() + 1); }, interval);
    }
    function restart() { if (timer) start(); }

    w.classList.add("skw-on", "skw-s" + style);
    if (n < 2) w.classList.add("skw-solo");
    render();

    // klik panah/titik (label radio) & geser (swipe) mengubah radio -> sinkronkan tampilan
    inputs.forEach(function (r) { r.addEventListener("change", function () { render(); restart(); }); });

    // klik kartu yang mengintip = pindah ke kartu itu (bukan buka link)
    w.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest(".sldA") : null;
      var i = c ? cards.indexOf(c) : -1;
      if (i > -1 && !c.classList.contains("active")) { e.preventDefault(); go(i); }
    });

    if (cfg.PAUSE_ON_HOVER) {
      w.addEventListener("mouseenter", function () { hover = true; stop(); });
      w.addEventListener("mouseleave", function () { hover = false; start(); });
    }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    start();
  }

  function run() { [].forEach.call(document.querySelectorAll(".sldW"), init); }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", run) : run();
})();
