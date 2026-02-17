(() => {
  // Tabs (Services / Produits / ...)
  const tabs = document.querySelectorAll(".faq-tab");
  const panels = document.querySelectorAll(".faq-panel");

  if (tabs.length && panels.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-tab");
        if (!id) return;

        tabs.forEach((t) => t.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");
        const target = document.getElementById(id);
        if (target) target.classList.add("active");
      });
    });
  }

  // Accordion items (question => open)
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
})();
