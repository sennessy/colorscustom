(() => {
  const verticalItems = document.querySelectorAll(".tint-vertical-item");
  const horizontalItems = document.querySelectorAll(".tint-horizontal-item");

  if (!verticalItems.length || !horizontalItems.length) return;

  const setActive = (index) => {
    verticalItems.forEach((it) => it.classList.remove("active"));
    horizontalItems.forEach((it) => it.classList.remove("active"));

    verticalItems[index]?.classList.add("active");
    horizontalItems[index]?.classList.add("active");
  };

  verticalItems.forEach((item, i) => {
    item.addEventListener("click", () => setActive(i));
  });

  setActive(0);

  // Options (si tu as des badges cliquables)
  document.querySelectorAll(".tint-options span").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".tint-options span").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });
})();
