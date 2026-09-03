/* =========================================================
   Limos — "Menemeni Hazırla" basılı-tut animasyonu
   Butona basılı tut → sahan döner + hafif blur; yeterince
   tutulunca Menemen1 (malzemeler) → Menemen2 (pişmiş) geçişi.
   Saf JS + setInterval; harici kütüphane yok.
   ========================================================= */
(function () {
  "use strict";

  var fig = document.getElementById("menemen-fig");
  if (!fig) return;
  var btn   = document.getElementById("menemen-btn");
  var spin  = document.getElementById("menemen-spin");
  var imgDone = fig.querySelector(".cook-img--done");
  var label = fig.querySelector(".cook-btn-label");
  var hint  = fig.querySelector(".cook-hint");
  if (!btn || !spin || !imgDone) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COOK_MS  = 2600;          // Menemen2'ye geçmek için gereken basılı tutma süresi
  var RELEASE  = COOK_MS * 0.5; // bırakınca geri sarma süresi
  var MAX_SPIN = reduce ? 0 : 520;   // derece / sn
  var FADE_FROM = 0.62;         // bu ilerlemeden sonra pişmiş görsele geçiş başlar

  var held = false, done = false;
  var p = 0, angle = 0, spinVel = 0;
  var landing = false, landTarget = 0;
  var timer = null, lastT = 0;

  function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function render() {
    spin.style.transform = "rotate(" + angle.toFixed(1) + "deg)";
    var blur = (MAX_SPIN ? Math.min(5, (spinVel / MAX_SPIN) * 5) : 0) + (done ? 0 : p * 1.6);
    spin.style.filter = blur > 0.06 ? "blur(" + blur.toFixed(2) + "px)" : "";
    var f = p <= FADE_FROM ? 0 : (p - FADE_FROM) / (1 - FADE_FROM);
    imgDone.style.opacity = (done ? 1 : f).toFixed(3);
    fig.style.setProperty("--p", (done ? 1 : p).toFixed(3));
  }

  function step(dt) {
    if (held && !done) {
      // serbest dönüş
      spinVel += (MAX_SPIN - spinVel) * Math.min(1, dt * 3.5);
      angle += spinVel * dt;
      if (angle > 1e6) angle -= 1e6;
      landing = false;
    } else {
      // bırakıldı → mevcut momentumla ilerleyip TAM olarak dik açıda (0°) yavaşlayıp dur
      if (!landing) {
        landing = true;
        landTarget = Math.round((angle + spinVel * 0.35) / 360) * 360;
      }
      var na = angle + (landTarget - angle) * Math.min(1, dt * 3);
      spinVel = Math.abs(na - angle) / Math.max(dt, 0.001);  // blur için görünen hız
      angle = na;
      if (Math.abs(landTarget - angle) < 0.25) { angle = 0; spinVel = 0; landing = false; }
    }

    if (held && !done) {
      p = Math.min(1, p + (dt * 1000) / COOK_MS);
      if (p >= 1) {
        done = true;
        fig.classList.remove("is-cooking");
        fig.classList.add("is-done");
        if (label) label.textContent = "Menemen hazır";
        if (hint) hint.textContent = "yeniden pişirmek için dokun";
      }
    } else if (!done) {
      p = Math.max(0, p - (dt * 1000) / RELEASE);
    }

    render();

    var busy = held || landing || (!done && p > 0 && p < 1) || angle !== 0;
    if (!busy) stopEngine();
  }

  function startEngine() {
    if (timer) return;
    lastT = nowMs();
    timer = window.setInterval(function () {
      var now = nowMs();
      var dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      step(dt);
    }, 1000 / 60);
  }
  function stopEngine() { if (timer) { window.clearInterval(timer); timer = null; } }
  function kick() { startEngine(); step(0.016); }

  function reset() {
    done = false; held = false;
    p = 0; angle = 0; spinVel = 0; landing = false;
    fig.classList.remove("is-cooking", "is-done");
    if (label) label.textContent = "Menemeni Hazırla";
    if (hint) hint.textContent = "basılı tut";
    spin.style.filter = "";
    imgDone.style.opacity = "0";
    render();
  }

  function press(e) {
    if (e && e.cancelable) e.preventDefault();
    if (done) { reset(); return; }          // pişmişken dokunuş → baştan
    held = true;
    fig.classList.add("is-cooking");
    if (label) label.textContent = "Pişiyor…";
    kick();
  }
  function releaseHold() {
    if (!held) return;
    held = false;
    fig.classList.remove("is-cooking");
    if (!done && label) label.textContent = "Menemeni Hazırla";
    kick();
  }

  btn.addEventListener("pointerdown", function (e) {
    if (btn.setPointerCapture && e.pointerId != null) { try { btn.setPointerCapture(e.pointerId); } catch (x) {} }
    press(e);
  });
  btn.addEventListener("pointerup", releaseHold);
  btn.addEventListener("pointercancel", releaseHold);
  btn.addEventListener("pointerleave", releaseHold);
  window.addEventListener("pointerup", releaseHold);
  btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  /* klavye: Space / Enter basılı tut */
  btn.addEventListener("keydown", function (e) {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!held) press(null);
  });
  btn.addEventListener("keyup", function (e) {
    if (e.key !== " " && e.key !== "Enter") return;
    releaseHold();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) releaseHold();
  });

  render();
})();
