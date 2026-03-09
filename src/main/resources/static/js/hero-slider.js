(() => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dots = slider.querySelectorAll(".hero-dot");
  const prevBtn = slider.querySelector(".hero-arrow--prev");
  const nextBtn = slider.querySelector(".hero-arrow--next");

  if (!slides.length || !dots.length) return;

  let current = 0;
  let timer = null;
  const canAutoPlay = slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 6000;

  const setActive = (index) => {
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle("active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((d, i) => {
      const active = i === index;
      d.classList.remove("active");
      d.classList.toggle("active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
      d.setAttribute("tabindex", active ? "0" : "-1");
    });

    current = index;
  };

  const next = () => setActive((current + 1) % slides.length);
  const prev = () => setActive((current - 1 + slides.length) % slides.length);

  const start = () => {
    if (!canAutoPlay || document.hidden) return;
    stop();
    timer = setInterval(next, INTERVAL);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  dots.forEach((dot, i) => {
    dot.setAttribute("role", "tab");
    dot.addEventListener("click", () => {
      setActive(i);
      start();
    });
    dot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        dots[current].focus();
        start();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        dots[current].focus();
        start();
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prev();
      start();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      next();
      start();
    });
  }

  slider.addEventListener("click", (e) => {
    if (e.target.closest("a,button,input,textarea,select,label")) return;
    const rect = slider.getBoundingClientRect();
    const isLeft = e.clientX < rect.left + rect.width / 2;
    if (isLeft) prev();
    else next();
    start();
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  // clavier
  slider.setAttribute("tabindex", "0");
  slider.setAttribute("role", "region");
  slider.setAttribute("aria-roledescription", "carousel");
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      next();
      start();
    }
    if (e.key === "ArrowLeft") {
      prev();
      start();
    }
    if (e.key === "Home") {
      setActive(0);
      start();
    }
    if (e.key === "End") {
      setActive(slides.length - 1);
      start();
    }
  });

  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", (e) => {
    const nextFocus = e.relatedTarget;
    if (nextFocus instanceof Node && slider.contains(nextFocus)) return;
    start();
  });

  setActive(0);
  start();
})();
