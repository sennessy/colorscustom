(() => {
  const navMenu = document.querySelector(".nav-menu");
  const burger = document.querySelector(".burger");
  const dropdowns = document.querySelectorAll(".nav-item.dropdown");

  // expose toggleMenu() car ton HTML l'appelle inline
  window.toggleMenu = function toggleMenu() {
    if (!navMenu) return;
    navMenu.classList.toggle("open");
  };

  // Mobile: ouvrir/fermer dropdown au clic
  function isMobile() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector("a");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      if (!isMobile()) return; // desktop géré au hover CSS
      e.preventDefault();
      dd.classList.toggle("open");
    });
  });

  // Fermer menu mobile si on clique un lien (hors dropdown trigger)
  if (navMenu) {
    navMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const parentDropdown = a.closest(".dropdown");
      if (isMobile() && parentDropdown && a === parentDropdown.querySelector("a")) {
        // c'était le trigger du dropdown => on ne ferme pas tout
        return;
      }

      if (isMobile()) navMenu.classList.remove("open");
    });
  }

  // Fermer menu si resize vers desktop
  window.addEventListener("resize", () => {
    if (!navMenu) return;
    if (!isMobile()) {
      navMenu.classList.remove("open");
      dropdowns.forEach((d) => d.classList.remove("open"));
    }
  });
})();
