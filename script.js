/* Charlles de Tiringa 4088 — interações, intro e sol de xilogravura */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------- Sol (assinatura): feixe de raios de mão, com variação fixa ---------- */
  var VARIATION = [1.0, 0.78, 1.12, 0.86, 0.94, 1.08, 0.72, 1.02, 0.88, 1.14, 0.8, 0.98,
                   1.1, 0.84, 0.96, 1.06, 0.76, 1.0, 0.9, 1.12, 0.82, 0.98, 1.08, 0.86];

  function buildSun(svg) {
    var ns = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", "0 0 240 240");
    svg.setAttribute("role", "img");
    svg.setAttribute("focusable", "false");
    if (!svg.getAttribute("aria-hidden")) svg.setAttribute("aria-hidden", "true");

    var rayStart = parseInt(svg.dataset.rayStart || "46", 10);
    var n = VARIATION.length;
    var step = 360 / n;

    for (var i = 0; i < n; i++) {
      var ang = (i * step - 90) * (Math.PI / 180);
      var inner = rayStart;
      var outer = rayStart + 26 * VARIATION[i];
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", (120 + Math.cos(ang) * inner).toFixed(2));
      line.setAttribute("y1", (120 + Math.sin(ang) * inner).toFixed(2));
      line.setAttribute("x2", (120 + Math.cos(ang) * outer).toFixed(2));
      line.setAttribute("y2", (120 + Math.sin(ang) * outer).toFixed(2));
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "3.5");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    }

    var disc = document.createElementNS(ns, "circle");
    disc.setAttribute("cx", "120");
    disc.setAttribute("cy", "120");
    disc.setAttribute("r", "40");
    disc.setAttribute("fill", "currentColor");
    svg.appendChild(disc);
  }

  document.querySelectorAll("svg.sun").forEach(buildSun);

  /* ---------- Alternador de tema: PSB (claro) / Sertão (escuro) ---------- */
  var themeSwitch = document.getElementById("themeSwitch");
  if (themeSwitch) {
    var themeLabels = {
      psb: "Tema PSB (modo claro institucional). Alternar para o tema Sertão.",
      sertao: "Tema Sertão (modo escuro poente, padrão). Alternar para o tema PSB."
    };
    function syncTheme() {
      var t = document.documentElement.getAttribute("data-theme") === "sertao" ? "sertao" : "psb";
      themeSwitch.setAttribute("aria-checked", t === "psb" ? "true" : "false");
      themeSwitch.setAttribute("aria-label", themeLabels[t]);
      var metaColor = document.querySelector('meta[name="theme-color"]');
      if (metaColor) metaColor.content = t === "psb" ? "#7a1d10" : "#1b2340";
      Array.prototype.forEach.call(themeSwitch.querySelectorAll(".sw-seg"), function (seg) {
        seg.classList.toggle("is-active", seg.dataset.seg === t);
      });
    }
    syncTheme();
    themeSwitch.addEventListener("click", function () {
      var t = document.documentElement.getAttribute("data-theme") === "sertao" ? "psb" : "sertao";
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("cr-tema", t); } catch (e) {}
      syncTheme();
    });
  }

  /* ---------- Intro: 4088 · Charlles Rekson ---------- */
  var intro = document.getElementById("intro");

  function splitText(el) {
    var text = el.dataset.text;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      if (text[i] === " ") {
        span.className = "sp";
        span.setAttribute("aria-hidden", "true");
      } else {
        span.textContent = text[i];
      }
      frag.appendChild(span);
    }
    el.textContent = "";
    el.appendChild(frag);
  }
  var introNum = document.querySelector(".intro-num");
  var introName = document.querySelector(".intro-name");
  if (introNum) splitText(introNum);
  if (introName) {
    splitText(introName);
    Array.prototype.forEach.call(introName.children, function (span, i) {
      span.style.animationDelay = (1.05 + i * 0.028).toFixed(3) + "s";
    });
  }

  function finishIntro() {
    body.classList.add("is-ready");
    body.classList.remove("is-intro");
    if (intro) intro.remove();
  }

  if (intro && !prefersReduced) {
    body.classList.add("is-intro");
    intro.classList.add("is-anim");

    var skip = function () {
      if (intro.classList.contains("is-exit")) return;
      intro.classList.add("is-exit");
      window.setTimeout(finishIntro, 750);
    };

    intro.addEventListener("click", skip);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    });
    window.setTimeout(skip, 2600);
  } else {
    finishIntro();
  }

  /* ---------- Marquee: duplica a fita para o giro contínuo ---------- */
  var track = document.getElementById("marquee");
  if (track && !prefersReduced) {
    Array.from(track.children).forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });
  }

  /* ---------- Navegação ao rolar ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Parallax sutil do hero (só telas largas; mobile sem zoom) ---------- */
  var heroBg = document.querySelector(".hero-bg");
  var isDesktop = window.matchMedia("(min-width: 768px)").matches;
  if (heroBg && !prefersReduced && isDesktop) {
    var ticking = false;
    function onParallax() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroBg.style.transform = "scale(1.12) translateY(" + (y * 0.22).toFixed(1) + "px)";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onParallax, { passive: true });
  }

  /* ---------- Compartilhar nas redes sociais ---------- */
  var SHARE_TEXT = "Charlles de Tiringa 4088 — Deputado Federal · PSB. Vote 4088: a voz do Sertão pra Brasília.";

  function shareHref(net, url, text) {
    var enc = encodeURIComponent;
    if (net === "whatsapp") return "https://wa.me/?text=" + enc(text + " " + url);
    if (net === "telegram") return "https://t.me/share/url?url=" + enc(url) + "&text=" + enc(text);
    if (net === "x") return "https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url);
    if (net === "facebook") return "https://www.facebook.com/sharer/sharer.php?u=" + enc(url);
    return url;
  }

  function copyToClipboard(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function setupShare(wrap, btn, pop) {
    var links = pop.querySelectorAll(".share-net");
    Array.prototype.forEach.call(links, function (el) {
      el.addEventListener("click", function () {
        if (el.dataset.net === "copy") {
          copyToClipboard(location.href, function () {
            var orig = el.innerHTML;
            el.textContent = "Link copiado!";
            window.setTimeout(function () { el.innerHTML = orig; }, 2000);
          });
        }
      });
    });
    function close() {
      pop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (navigator.share && window.matchMedia("(max-width: 900px)").matches) {
        navigator.share({ title: document.title, text: SHARE_TEXT, url: location.href }).catch(function () {});
        return;
      }
      if (pop.hidden) {
        pop.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      } else {
        close();
      }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  var shareWrap = document.getElementById("shareWrap");
  var shareBtn = document.getElementById("shareBtn");
  var sharePop = document.getElementById("sharePop");
  if (shareWrap && shareBtn && sharePop) {
    Array.prototype.forEach.call(sharePop.querySelectorAll("a.share-net"), function (el) {
      el.href = shareHref(el.dataset.net, location.href, SHARE_TEXT);
    });
    setupShare(shareWrap, shareBtn, sharePop);
  }

  var shareWrapBar = document.getElementById("shareWrapBar");
  var shareBtnBar = document.getElementById("shareBtnBar");
  if (shareWrapBar && shareBtnBar && sharePop) {
    var popBar = sharePop.cloneNode(true);
    popBar.id = "sharePopBar";
    Array.prototype.forEach.call(popBar.querySelectorAll("a.share-net"), function (el) {
      el.href = shareHref(el.dataset.net, location.href, SHARE_TEXT);
    });
    shareWrapBar.appendChild(popBar);
    setupShare(shareWrapBar, shareBtnBar, popBar);
  }

  /* ---------- Barra de apoio (mobile) ---------- */
  var bar = document.getElementById("barMobile");
  if (bar) {
    var BAR_THRESHOLD = 420;
    function onBar() {
      bar.classList.toggle("is-visible", window.scrollY > BAR_THRESHOLD);
    }
    window.addEventListener("scroll", onBar, { passive: true });
    onBar();
  }

  /* ---------- Revelação ao rolar ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();

// Contagem regressiva das urnas - 4 de outubro de 2026
(function () {
  var alvo = new Date(2026, 9, 4, 8, 0, 0);
  var chip = document.getElementById("heroCount");
  if (!chip) return;
  var dias = Math.ceil((alvo.getTime() - Date.now()) / 86400000);
  if (dias < 0) return;
  var el = document.getElementById("heroDays");
  if (el) el.textContent = dias;
  chip.hidden = false;
})();
