(() => {
  const CARD_SELECTOR = ".service-benefit-card, .enterprise-benefit-card";
  const DETAILS_SELECTOR = "details.service-benefit-more, details.enterprise-benefit-more";
  const GROUP_SELECTOR = ".tint-benefits-grid, .enterprise-benefits-grid";

  const syncCardState = (detailsList) => {
    detailsList.forEach((detailsEl) => {
      const card = detailsEl.closest(CARD_SELECTOR);
      if (!card) {
        return;
      }
      card.classList.toggle("is-expanded", detailsEl.open);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const groups = document.querySelectorAll(GROUP_SELECTOR);
    if (!groups.length) {
      return;
    }

    groups.forEach((group) => {
      const detailsList = Array.from(group.querySelectorAll(DETAILS_SELECTOR));
      if (!detailsList.length) {
        return;
      }
      const isExclusive = group.dataset.accordionExclusive !== "false";

      detailsList.forEach((detailsEl) => {
        detailsEl.addEventListener("toggle", () => {
          if (isExclusive && detailsEl.open) {
            detailsList.forEach((other) => {
              if (other !== detailsEl) {
                other.open = false;
              }
            });
          }
          syncCardState(detailsList);
        });
      });

      syncCardState(detailsList);
    });
  });
})();
