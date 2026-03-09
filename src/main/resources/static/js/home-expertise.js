(() => {
  const track = document.getElementById("expertise-track");
  if (!track) return;

  const tiles = Array.from(track.querySelectorAll(".home-expertise-tile"));
  if (!tiles.length) return;

  const setActive = (tile) => {
    tiles.forEach((item) => item.classList.remove("is-active"));
    tile.classList.add("is-active");
  };

  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", () => setActive(tile));
    tile.addEventListener("focus", () => setActive(tile));
    tile.addEventListener("click", () => setActive(tile));
  });
})();
