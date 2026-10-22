(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var root = document.documentElement;

  var STATUS = {
    online:  ["Online", "#3ddc84"],
    idle:    ["Abwesend", "#faa61a"],
    dnd:     ["Bitte nicht stören", "#f04747"],
    offline: ["Offline", "#747f8d"]
  };

  /* ---------- Theme + Fonts ---------- */
  function applyTheme() {
    var t = CONFIG.theme || {};
    var f = CONFIG.fonts || {};
    var map = {
      "--bg": t.background, "--card": t.card, "--row": t.row,
      "--border": t.border, "--accent": t.accent, "--muted": t.muted,
      "--card-max": t.cardMaxWidth, "--card-radius": t.cardRadius
    };
    Object.keys(map).forEach(function (k) {
      if (map[k]) root.style.setProperty(k, map[k]);
    });
    if (f.heading) root.style.setProperty("--font-heading", '"' + f.heading + '"');
    if (f.body)    root.style.setProperty("--font-body", '"' + f.body + '"');
    if (f.mono)    root.style.setProperty("--font-mono", '"' + f.mono + '"');

    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme && t.background) theme.setAttribute("content", t.background);
  }

  function loadFonts() {
    var f = CONFIG.fonts || {};
    var names = [f.heading, f.body, f.mono].filter(Boolean);
    var uniq = names.filter(function (n, i) { return names.indexOf(n) === i; });
    if (!uniq.length) return;
    var q = uniq.map(function (n) {
      return "family=" + encodeURIComponent(n).replace(/%20/g, "+") + ":wght@400;500;700";
    }).join("&");
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?" + q + "&display=swap";
    document.head.appendChild(link);
  }

  /* ---------- Profil ---------- */
  var img = $("#avatarImg");
  var fb = $("#avatarFallback");

  img.onload = function () { img.hidden = false; fb.hidden = true; };
  img.onerror = function () { img.hidden = true; fb.hidden = false; };

  function setAvatar(url) {
    if (!url) { img.hidden = true; fb.hidden = false; return; }
    if (img.dataset.src !== url) {
      img.dataset.src = url;
      img.src = url;
    }
  }

  function setName(name) {
    $("#name").textContent = name;
    fb.textContent = (name || "?").charAt(0).toUpperCase();
    document.title = name;
  }

  function discordAvatar(u) {
    if (!u || !u.avatar) return "";
    var ext = u.avatar.indexOf("a_") === 0 ? "gif" : "png";
    return "https://cdn.discordapp.com/avatars/" + u.id + "/" + u.avatar + "." + ext + "?size=256";
  }

  /* ---------- Socials ---------- */
  function renderSocials() {
    var list = $("#socials");
    list.innerHTML = "";
    var i = 0;
    (CONFIG.socials || []).forEach(function (s) {
      if (s.enabled === false) return;
      if (!/^https?:\/\//i.test(s.url || "")) return;

      var a = document.createElement("a");
      a.className = "social";
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.animationDelay = (i * 70) + "ms";
      i++;

      var ic = document.createElement("span");
      ic.className = "icon";
      var im = document.createElement("img");
      im.alt = "";
      im.loading = "lazy";
      im.src = s.iconUrl || ("https://cdn.simpleicons.org/" + encodeURIComponent(s.icon || s.name.toLowerCase()) + "/ffffff");
      im.onerror = function () { im.remove(); ic.textContent = (s.name || "?").charAt(0); };
      ic.appendChild(im);

      var txt = document.createElement("span");
      txt.className = "text";
      var n = document.createElement("strong");
      n.textContent = s.name || "";
      var d = document.createElement("small");
      d.textContent = s.description || "";
      txt.appendChild(n);
      txt.appendChild(d);

      var ar = document.createElement("span");
      ar.className = "arrow";
      ar.textContent = "↗";

      a.appendChild(ic);
      a.appendChild(txt);
      a.appendChild(ar);
      list.appendChild(a);
    });
  }

  /* ---------- Lanyard (Discord-Status) ---------- */
  function activityText(d) {
    if (d.listening_to_spotify && d.spotify) return "hört " + d.spotify.song;
    var acts = (d.activities || []).filter(function (a) { return a.type !== 4; });
    var a = acts[0];
    if (!a) return "";
    switch (a.type) {
      case 0: return "spielt " + a.name;
      case 1: return "streamt " + (a.details || a.name);
      case 2: return "hört " + a.name;
      case 3: return "schaut " + a.name;
      case 5: return "kämpft in " + a.name;
      default: return a.name;
    }
  }

  function showStatus(d) {
    var L = CONFIG.lanyard || {};
    var s = STATUS[d.discord_status] || STATUS.offline;
    var act = L.showActivity !== false ? activityText(d) : "";
    $("#statusText").textContent = s[0] + (act ? " · " + act : "");
    $("#statusDot").style.background = s[1];
    $("#avatarDot").style.background = s[1];
    $("#avatarDot").hidden = false;
    $("#status").hidden = false;
  }

  function fetchLanyard() {
    var L = CONFIG.lanyard || {};
    var id = CONFIG.discordId || "";
    if (!L.enabled || !/^\d+$/.test(id)) return;

    fetch("https://api.lanyard.rest/v1/users/" + id, { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) throw new Error("Lanyard: " + (j.error && j.error.message));
        var d = j.data;
        var u = d.discord_user;

        if ((CONFIG.name || {}).source === "discord") {
          setName(u.global_name || u.username);
        }
        if ((CONFIG.avatar || {}).source === "discord") {
          setAvatar(discordAvatar(u) || (CONFIG.avatar || {}).custom || "");
        }
        showStatus(d);
      })
      .catch(function (e) { console.warn(e); });
  }

  /* ---------- Partikel ---------- */
  function particles() {
    var E = CONFIG.effects || {};
    var cv = $("#bg");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!E.particles || reduce) { cv.remove(); return; }

    var ctx = cv.getContext("2d");
    var w, h, dpr, ps = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = (E.particleCount || 60) * (w < 600 ? 0.6 : 1);
      ps = [];
      for (var i = 0; i < n; i++) {
        ps.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.4
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();

        for (var j = i + 1; j < ps.length; j++) {
          var q = ps[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(255,255,255," + (0.12 * (1 - dist / 110)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    frame();
  }

  /* ---------- Tilt + Glow ---------- */
  function interactions() {
    var E = CONFIG.effects || {};
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.querySelectorAll(".social").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        if (E.glow) {
          el.style.setProperty("--mx", (x * 100) + "%");
          el.style.setProperty("--my", (y * 100) + "%");
        }
        if (E.tilt) {
          el.style.transform =
            "perspective(700px) rotateX(" + ((0.5 - y) * 8) + "deg) rotateY(" + ((x - 0.5) * 8) + "deg) translateY(-2px)";
        }
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Start ---------- */
  function init() {
    var E = CONFIG.effects || {};
    applyTheme();
    loadFonts();

    document.body.classList.toggle("fade", !!E.fadeIn);
    document.body.classList.toggle("no-glow", !E.glow);

    $("#bio").textContent = CONFIG.bio || "";
    $("#footer").textContent = CONFIG.footer || "";

    setName((CONFIG.name || {}).custom || "maxihihi");
    setAvatar((CONFIG.avatar || {}).custom || "");

    renderSocials();
    interactions();
    particles();

    fetchLanyard();
    var L = CONFIG.lanyard || {};
    if (L.enabled) setInterval(fetchLanyard, Math.max(5, L.refreshSeconds || 15) * 1000);
  }

  init();
})();
