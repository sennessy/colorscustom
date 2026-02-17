(() => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dots = slider.querySelectorAll(".hero-dot");

  if (!slides.length || !dots.length) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 6000;

  const setActive = (index) => {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    current = index;
  };

  const next = () => setActive((current + 1) % slides.length);
  const prev = () => setActive((current - 1 + slides.length) % slides.length);

  const start = () => {
    stop();
    timer = setInterval(next, INTERVAL);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      setActive(i);
      start();
    });
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // clavier
  slider.setAttribute("tabindex", "0");
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); start(); }
    if (e.key === "ArrowLeft") { prev(); start(); }
  });

  setActive(0);
  start();
})();
