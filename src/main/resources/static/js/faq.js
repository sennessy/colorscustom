(() => {
  const tabs = [...document.querySelectorAll(".faq-tab")];
  const panels = [...document.querySelectorAll(".faq-panel")];
  const searchInput = document.getElementById("faq-search");
  const openAllBtn = document.getElementById("faq-open-all");
  const closeAllBtn = document.getElementById("faq-close-all");
  const count = document.getElementById("faq-count");

  if (!tabs.length || !panels.length) return;

  const getActivePanel = () =>
    panels.find((panel) => panel.classList.contains("active")) || panels[0];

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const initRawText = () => {
    panels.forEach((panel) => {
      panel.querySelectorAll(".faq-item").forEach((item) => {
        const q = item.querySelector(".faq-question__text");
        const a = item.querySelector(".faq-answer p");
        if (q && !q.dataset.raw) q.dataset.raw = q.textContent || "";
        if (a && !a.dataset.raw) a.dataset.raw = a.textContent || "";
      });
    });
  };

  const highlight = (el, term) => {
    if (!el || !el.dataset.raw) return;
    if (!term) {
      el.textContent = el.dataset.raw;
      return;
    }
    const rx = new RegExp(`(${escapeRegex(term)})`, "gi");
    el.innerHTML = el.dataset.raw.replace(rx, "<mark class=\"faq-highlight\">$1</mark>");
  };

  const setItemState = (item, open) => {
    item.classList.toggle("open", open);
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (answer) answer.hidden = !open;
  };

  const attachAccordionEvents = () => {
    panels.forEach((panel) => {
      panel.querySelectorAll(".faq-item").forEach((item) => {
        const btn = item.querySelector(".faq-question");
        if (!btn || btn.dataset.bound === "1") return;

        btn.dataset.bound = "1";
        btn.addEventListener("click", () => {
          const shouldOpen = !item.classList.contains("open");
          panel.querySelectorAll(".faq-item").forEach((other) => setItemState(other, false));
          setItemState(item, shouldOpen);
        });
      });
    });
  };

  const updateVisibleCount = () => {
    const panel = getActivePanel();
    const visibleItems = panel
      ? [...panel.querySelectorAll(".faq-item")].filter(
          (item) => item.style.display !== "none"
        ).length
      : 0;
    if (count) count.textContent = String(visibleItems);
  };

  const applySearch = () => {
    const panel = getActivePanel();
    if (!panel) return;

    const term = (searchInput?.value || "").trim().toLowerCase();
    panel.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-question__text");
      const a = item.querySelector(".faq-answer p");
      const qRaw = q?.dataset.raw || "";
      const aRaw = a?.dataset.raw || "";
      const text = `${qRaw} ${aRaw}`.toLowerCase();
      const visible = !term || text.includes(term);
      item.style.display = visible ? "" : "none";
      if (!visible) setItemState(item, false);
      if (visible) {
        highlight(q, term);
        highlight(a, term);
      } else {
        highlight(q, "");
        highlight(a, "");
      }
    });
    updateVisibleCount();
  };

  const activateTab = (tab, shouldFocus = false) => {
    const id = tab.getAttribute("data-tab");
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    tabs.forEach((t, index) => {
      const selected = t === tab;
      t.classList.toggle("active", selected);
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.setAttribute("tabindex", selected ? "0" : "-1");
      if (!t.id) t.id = `faq-tab-${index + 1}`;
    });

    panels.forEach((p) => {
      const isTarget = p === target;
      p.classList.toggle("active", isTarget);
      p.classList.remove("is-visible");
      p.hidden = !isTarget;
      if (isTarget) {
        p.setAttribute("aria-labelledby", tab.id);
      }
    });

    target.classList.add("active");
    target.hidden = false;
    requestAnimationFrame(() => {
      target.classList.add("is-visible");
    });
    target.querySelectorAll(".faq-item").forEach((item) => setItemState(item, false));

    if (shouldFocus) tab.focus();
    applySearch();
  };

  tabs.forEach((tab, index) => {
    if (!tab.id) tab.id = `faq-tab-${index + 1}`;
    tab.setAttribute("tabindex", tab.classList.contains("active") ? "0" : "-1");
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === currentIndex) return;

      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
  }

  if (openAllBtn) {
    openAllBtn.addEventListener("click", () => {
      const panel = getActivePanel();
      if (!panel) return;
      panel.querySelectorAll(".faq-item").forEach((item) => {
        if (item.style.display !== "none") setItemState(item, true);
      });
    });
  }

  if (closeAllBtn) {
    closeAllBtn.addEventListener("click", () => {
      const panel = getActivePanel();
      if (!panel) return;
      panel.querySelectorAll(".faq-item").forEach((item) => setItemState(item, false));
    });
  }

  initRawText();
  panels.forEach((panel) => {
    panel.hidden = !panel.classList.contains("active");
  });
  const initialTab = tabs.find((tab) => tab.classList.contains("active")) || tabs[0];
  activateTab(initialTab);
  attachAccordionEvents();
  applySearch();
})();
