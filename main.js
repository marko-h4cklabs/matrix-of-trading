(function () {
  "use strict";
  var C = window.MOT_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile menu */
  var btn = document.querySelector(".menu-btn");
  var links = document.getElementById("nav-links");
  if (btn && links) {
    var setOpen = function (open) {
      links.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", function () { setOpen(!links.classList.contains("open")); });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* Links from config */
  if (C.telegramUrl) {
    document.querySelectorAll("[data-telegram]").forEach(function (a) {
      a.href = C.telegramUrl; a.target = "_blank"; a.rel = "noopener";
    });
  }
  document.querySelectorAll("[data-youtube]").forEach(function (a) {
    if (C.youtubeChannelUrl) a.href = C.youtubeChannelUrl; else a.href = "#live";
  });
  var buy = document.getElementById("buy-link");
  if (buy) {
    if (C.checkoutUrl) { buy.href = C.checkoutUrl; buy.target = "_blank"; buy.rel = "noopener"; }
    else if (C.telegramUrl) { buy.href = C.telegramUrl; buy.target = "_blank"; buy.rel = "noopener"; }
  }

  /* Seats and launch date */
  var seats = document.getElementById("seats-left");
  if (seats && typeof C.seatsLeft === "number") seats.textContent = Math.max(0, Math.min(8, C.seatsLeft));
  var launch = document.getElementById("launch");
  if (launch && C.launchDate) launch.textContent = "● Launching on the new moon · " + C.launchDate;

  /* YouTube live embed */
  var video = document.getElementById("video");
  if (video && C.youtubeChannelId) {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube.com/embed/live_stream?channel=" + encodeURIComponent(C.youtubeChannelId) + "&mute=1&autoplay=1";
    f.title = "Matrix Of Trading live stream on XAUUSD";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.loading = "lazy";
    f.allowFullscreen = true;
    video.appendChild(f);
    video.classList.add("has-embed");
    var ph = video.querySelector(".video-placeholder");
    if (ph) ph.remove();
  }

  /* Indicator screenshots: drop chronos.png, ares.png, selene.png into /assets */
  document.querySelectorAll(".shot[data-img]").forEach(function (box) {
    var img = new Image();
    img.onload = function () {
      img.alt = box.getAttribute("data-alt") || "";
      box.textContent = "";
      box.appendChild(img);
      box.classList.add("loaded");
    };
    img.src = box.getAttribute("data-img");
  });

  /* Numerology letters */
  var map = { A: 1, D: 4, F: 6, G: 7, I: 9, M: 4, N: 5, O: 6, R: 9, T: 2, X: 6 };
  var lettersEl = document.getElementById("letters");
  if (lettersEl) {
    ["MATRIX", "OF", "TRADING"].forEach(function (w) {
      var row = document.createElement("div");
      row.className = "word";
      var sum = 0;
      var chips = w.split("").map(function (l) {
        sum += map[l];
        return '<span class="chip"><b>' + l + "</b><i>" + map[l] + "</i></span>";
      }).join("");
      row.innerHTML = '<span class="word-name">' + w + '</span><span class="chips">' + chips + '</span><span class="word-sum">= ' + sum + "</span>";
      lettersEl.appendChild(row);
    });
  }

  /* Code rain: digits and planetary glyphs */
  var rain = document.querySelector(".rain");
  if (rain) {
    var glyphs = ["0","1","2","3","4","5","6","7","8","9","8","8","2","2","\u2609","\u263D","\u263F","\u2640\uFE0E","\u2642\uFE0E","\u2643","\u2644","\u221E","\u2649\uFE0E"];
    var seed = 22;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var build = function () {
      rain.innerHTML = "";
      var width = rain.clientWidth || window.innerWidth;
      var count = Math.ceil(width / 30);
      var frag = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        var len = 12 + Math.floor(rnd() * 20), chars = [];
        for (var j = 0; j < len; j++) chars.push(glyphs[Math.floor(rnd() * glyphs.length)]);
        var col = document.createElement("div");
        col.className = "rain-col";
        col.textContent = chars.join("\n");
        col.style.left = (i * 30 + 4) + "px";
        col.style.opacity = (0.05 + rnd() * 0.15).toFixed(2);
        if (reduceMotion) {
          col.style.top = (-200 + Math.floor(rnd() * 500)) + "px";
        } else {
          col.style.animationDuration = (16 + rnd() * 22).toFixed(1) + "s";
          col.style.animationDelay = "-" + (rnd() * 30).toFixed(1) + "s";
        }
        frag.appendChild(col);
      }
      rain.appendChild(frag);
    };
    build();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { seed = 22; build(); }, 250); });
  }

  /* Email signup */
  var form = document.getElementById("signup");
  var msg = document.getElementById("form-msg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!email || !form.email.checkValidity()) {
        msg.textContent = "Enter a valid email address.";
        msg.className = "form-msg error";
        form.email.focus();
        return;
      }
      if (!C.emailFormEndpoint) {
        if (C.telegramUrl) { window.open(C.telegramUrl, "_blank", "noopener"); }
        msg.textContent = "Daily recaps are posted in the Telegram group.";
        msg.className = "form-msg";
        return;
      }
      msg.textContent = "Sending…";
      msg.className = "form-msg";
      fetch(C.emailFormEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        msg.textContent = "You’re on the list. The first recap arrives tomorrow.";
      }).catch(function () {
        msg.textContent = "Couldn’t sign you up. Check your connection and try again.";
        msg.className = "form-msg error";
      });
    });
  }
})();
