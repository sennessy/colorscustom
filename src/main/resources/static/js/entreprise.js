(() => {
  function scrollToCategories() {
    const target = document.getElementById("entreprises-categories");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Ton HTML appelle une fonction globale
  window.scrollToEntreprisesCategories = scrollToCategories;

  // Bonus: si tu veux aussi permettre les liens ancres (#...)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
