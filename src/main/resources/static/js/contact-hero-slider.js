(() => {
  const slider = document.getElementById("contactHeroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".contact-hero__slide"));
  const dots = Array.from(slider.querySelectorAll(".contact-hero__dot"));
  const prevBtn = slider.querySelector(".contact-hero__arrow--prev");
  const nextBtn = slider.querySelector(".contact-hero__arrow--next");
  if (!slides.length || !dots.length) return;

  let current = 0;
  let timer = null;
  let touchStartX = 0;
  const canAutoPlay = slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 6000;

  const setActive = (index) => {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
      dot.setAttribute("tabindex", active ? "0" : "-1");
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

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX;
    if (Math.abs(diff) < 45) return;
    if (diff < 0) next();
    if (diff > 0) prev();
    start();
  }, { passive: true });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", (e) => {
    const nextFocus = e.relatedTarget;
    if (nextFocus instanceof Node && slider.contains(nextFocus)) return;
    start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  setActive(0);
  start();
})();
