(() => {
  const slider = document.querySelector(".engagement-slider");
  if (!slider) return;

  // Molette => horizontal
  slider.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  }, { passive: false });
})();
