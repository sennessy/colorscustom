(() => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  // Validation légère (non bloquante, simple)
  form.addEventListener("submit", (e) => {
    const required = form.querySelectorAll("[required]");
    let ok = true;

    required.forEach((field) => {
      if (!field.value || !field.value.trim()) {
        ok = false;
        field.classList.add("is-error");
      } else {
        field.classList.remove("is-error");
      }
    });

    if (!ok) {
      e.preventDefault();
      // petit feedback minimal sans UI lourde
      alert("Merci de remplir les champs obligatoires.");
    }
  });
})();
