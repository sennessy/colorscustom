(() => {
  const slider = document.querySelector(".b2-slider");
  if (!slider) return;

  // Scroll horizontal avec molette (trackpad/mouse)
  slider.addEventListener("wheel", (e) => {
    // seulement si on scroll verticalement (deltaY)
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  }, { passive: false });

  // Snap “soft” au relâchement (optionnel léger)
  let t = null;
  slider.addEventListener("scroll", () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      // rien de violent: on laisse le scroll-snap CSS faire le job
    }, 80);
  });
})();
