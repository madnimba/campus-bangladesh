/* =========================================================
   Campus Bangladesh — interaction layer
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Theme ---------- */
  (function theme() {
    var root = document.documentElement;
    var toggle = $("#themeToggle");
    var stored = null;
    try { stored = localStorage.getItem("cb-theme"); } catch (e) {}

    var initial = stored ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    root.setAttribute("data-theme", initial);
    syncMeta(initial);

    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      syncMeta(next);
      try { localStorage.setItem("cb-theme", next); } catch (e) {}
    });

    function syncMeta(mode) {
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", mode === "dark" ? "#04140D" : "#F6F9F6");
    }
  })();

  /* ---------- Year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav, scroll progress, back to top, scrollspy ---------- */
  (function scrollUi() {
    var nav = $("#nav");
    var bar = $("#progressBar");
    var toTop = $("#toTop");
    var links = $$(".nav__links a");
    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (nav) nav.classList.toggle("is-stuck", y > 24);
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);

      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= window.innerHeight * 0.35) current = sections[i].id;
      }
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  })();

  /* ---------- Mobile menu ---------- */
  (function menu() {
    var burger = $("#burger");
    var links = $("#navLinks");
    if (!burger || !links) return;

    function setOpen(open) {
      links.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function reveal() {
    var items = $$(".reveal");
    items.forEach(function (el) {
      var d = el.getAttribute("data-delay");
      if (d) el.style.setProperty("--d", d);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Animated counters ---------- */
  (function counters() {
    var nums = $$(".stat__num");
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) { el.textContent = target + suffix; return; }

      el.textContent = "0" + suffix;
      var start = performance.now();
      var dur = 1500;
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Accordion ---------- */
  (function accordion() {
    $$(".acc").forEach(function (item) {
      var head = $(".acc__head", item);
      if (!head) return;
      head.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        $$(".acc").forEach(function (other) {
          other.classList.remove("is-open");
          var h = $(".acc__head", other);
          if (h) h.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("is-open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  })();

  /* ---------- Contact form (front-end only) ---------- */
  (function form() {
    var f = $("#contactForm");
    if (!f) return;
    var status = $("#formStatus");

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      $$("input, textarea", f).forEach(function (input) {
        var field = input.closest(".field");
        var invalid = input.hasAttribute("required") && !input.value.trim();
        if (input.type === "email" && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          invalid = true;
        }
        if (field) field.classList.toggle("has-error", invalid);
        if (invalid) ok = false;
      });

      if (!status) return;
      if (!ok) {
        status.textContent = "Please complete the highlighted fields.";
        status.classList.add("is-error");
        return;
      }
      status.classList.remove("is-error");
      status.textContent = "Thank you — your message is queued. Our team replies within three working days.";
      f.reset();
    });

    $$("input, textarea", f).forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  })();

  /* ---------- Pointer effects: spotlight, card glow, orbit parallax ---------- */
  (function pointer() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("pointer-fine");

    var orbit = $("#orbit");
    var raf = null;
    var mx = 0, my = 0;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        document.documentElement.style.setProperty("--mx", mx + "px");
        document.documentElement.style.setProperty("--my", my + "px");

        if (orbit) {
          var rx = (my / window.innerHeight - 0.5) * -10;
          var ry = (mx / window.innerWidth - 0.5) * 12;
          orbit.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        }
      });
    }, { passive: true });

    $$(".tilt-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--cx", (e.clientX - r.left) + "px");
        card.style.setProperty("--cy", (e.clientY - r.top) + "px");
      });
    });
  })();

  /* ---------- Hero starfield + satellite signal ---------- */
  (function starfield() {
    var canvas = $("#starfield");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var stars = [], waves = [], w = 0, h = 0, dpr = 1, raf, visible = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(Math.round((w * h) / 12000), 150);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.25,
          a: Math.random() * 0.5 + 0.15,
          tw: Math.random() * 0.02 + 0.004,
          vx: (Math.random() - 0.5) * 0.09,
          vy: (Math.random() - 0.5) * 0.09
        });
      }
    }

    function spawnWave() {
      waves.push({ x: Math.random() * w, y: Math.random() * h * 0.75, r: 0, max: 120 + Math.random() * 180 });
      if (waves.length > 4) waves.shift();
    }

    function isLight() { return document.documentElement.getAttribute("data-theme") === "light"; }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      var light = isLight();
      var base = light ? "18, 120, 70" : "180, 255, 210";

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.a += s.tw;
        if (s.a > 0.7 || s.a < 0.12) s.tw *= -1;
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + base + "," + (light ? s.a * 0.45 : s.a) + ")";
        ctx.fill();
      }

      for (var j = waves.length - 1; j >= 0; j--) {
        var v = waves[j];
        v.r += 1.1;
        var fade = 1 - v.r / v.max;
        if (fade <= 0) { waves.splice(j, 1); continue; }
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(47, 216, 115," + fade * (light ? 0.12 : 0.16) + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      resize();
      if (visible) raf = requestAnimationFrame(frame);
    });

    var waveTimer = setInterval(spawnWave, 2600);
    raf = requestAnimationFrame(frame);

    // pause the canvas when the hero scrolls away or the tab is hidden
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(frame);
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      cancelAnimationFrame(raf);
      clearInterval(waveTimer);
      if (!document.hidden && visible) {
        waveTimer = setInterval(spawnWave, 2600);
        raf = requestAnimationFrame(frame);
      }
    });
  })();
})();
