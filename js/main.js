(() => {
  "use strict";

  const WA_NUMBER = "5573988040185";
  const DEFAULT_MSG = "Olá! Vim pelo site da Clínica Odontoriso e gostaria de agendar uma avaliação.";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Links do WhatsApp (mensagem personalizada por tratamento) ---- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const topic = (a.dataset.wa || "").trim();
    const msg = topic
      ? `Olá! Vim pelo site da Clínica Odontoriso e gostaria de saber mais sobre ${topic}.`
      : DEFAULT_MSG;
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---- Header com fundo ao rolar ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { setMenu(false); closeDd(); }));

  /* ---- Dropdown de tratamentos ---- */
  const ddItems = document.querySelectorAll(".has-dd");
  function closeDd(except) {
    ddItems.forEach((li) => {
      if (li === except) return;
      li.classList.remove("open");
      const b = li.querySelector(".dd-toggle");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  ddItems.forEach((li) => {
    const btn = li.querySelector(".dd-toggle");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !li.classList.contains("open");
      closeDd(li);
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".has-dd")) closeDd(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setMenu(false); closeDd(); } });

  /* ---- Revelar ao rolar ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Contadores ---- */
  const fmt = (v, d) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const end = parseFloat(el.dataset.count);
    const d = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1500;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * eased, d);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animate(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    counters.forEach((el) => {
      const d = parseInt(el.dataset.decimals || "0", 10);
      el.textContent = fmt(0, d);
      co.observe(el);
    });
  }

  /* ---- Formulário de agendamento → WhatsApp ---- */
  const form = document.getElementById("book-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const field = form.nome.closest(".field");
      if (!nome) { field.classList.add("invalid"); form.nome.focus(); return; }
      field.classList.remove("invalid");
      const trat = form.trat.value || "uma avaliação geral";
      let msg = `Olá! Meu nome é ${nome}. Vim pelo site da Clínica Odontoriso e gostaria de agendar: ${trat}.`;
      if (form.per.value) msg += ` Melhor período: ${form.per.value}.`;
      if (form.msg.value.trim()) msg += ` ${form.msg.value.trim()}`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    });
  }

  /* ---- Ano no rodapé ---- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
