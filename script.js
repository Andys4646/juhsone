/* =========================================================
   Juhsone — interactions
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- preloader ---- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      preloader.classList.add("is-done");
      setTimeout(() => preloader && preloader.remove(), 900);
    }
  });
  // safety: never trap the page
  setTimeout(() => { if (preloader && document.body.contains(preloader)) preloader.remove(); }, 4000);

  /* ---- year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- nav: scrolled state ---- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => {
    if (window.scrollY > 60) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---- mobile menu ---- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    links.classList.remove("is-open");
    nav.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      nav.classList.toggle("is-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---- reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- subtle parallax ---- */
  const parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion && window.innerWidth > 720) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const factor = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -factor;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---- back to top ---- */
  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.9);
    }, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---- contact form (posts to /enquire.php, emails the atelier) ---- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = (form.name.value || "").trim();
      const email = (form.email.value || "").trim();
      const message = (form.message.value || "").trim();
      if (!name || !email || !message) {
        form.reportValidity && form.reportValidity();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      const orig = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      try {
        const res = await fetch(form.action || "/enquire.php", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({ ok: res.ok }));
        if (!data.ok) throw new Error("failed");

        const safe = (s) => s.replace(/[<>]/g, "");
        const done = document.createElement("p");
        done.className = "contact__intro";
        done.style.gridColumn = "1 / -1";
        done.innerHTML =
          "Thank you, " + safe(name) + " — your enquiry is on its way. " +
          "I'll reply to <strong>" + safe(email) + "</strong> shortly.";
        form.classList.add("is-sent");
        form.replaceChildren(done);
      } catch (err) {
        if (btn) { btn.disabled = false; btn.textContent = orig || "Send enquiry"; }
        let note = form.querySelector(".form-error");
        if (!note) {
          note = document.createElement("p");
          note.className = "form-error contact__direct";
          note.style.gridColumn = "1 / -1";
          form.appendChild(note);
        }
        note.innerHTML =
          "Sorry — that didn't go through. Please write to " +
          "<a href='mailto:hello@juhsone.com' style='color:var(--brass)'>hello@juhsone.com</a>.";
      }
    });
  }
})();
