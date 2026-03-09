(() => {
  if (window.__leadMailtoFormInitialized) {
    return;
  }
  window.__leadMailtoFormInitialized = true;

  const MAIL_TO_DEFAULT = "contact@colorscustom.ch";
  const EMAIL_DOMAINS = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "yahoo.com",
    "bluewin.ch",
    "proton.me"
  ];

  const SERVICE_BY_PATH = {
    "/services/vitres-teintees": "Vitres teintées",
    "/services/covering": "Covering",
    "/services/ceramique": "Revêtement céramique",
    "/services/feux-teintees": "Feux teintés",
    "/services/creation-visuelle": "Création visuelle",
    "/services/film-protection": "PPF coloré",
    "/entreprise/flotte": "Flotte d'entreprise",
    "/entreprise/publicite": "Publicité véhicule",
    "/entreprise/projet-sur-mesure": "Projet sur mesure",
    "/boutique/entretien": "Produits d'entretien",
    "/boutique/stickers": "Stickers et visuels",
    "/boutique/accessoires": "Accessoires intérieurs"
  };

  const inferServiceFromPath = () => {
    const path = window.location.pathname;
    if (SERVICE_BY_PATH[path]) {
      return SERVICE_BY_PATH[path];
    }
    if (path.startsWith("/services")) {
      return "Covering";
    }
    if (path.startsWith("/entreprise")) {
      return "Projet sur mesure";
    }
    if (path.startsWith("/boutique")) {
      return "Produits d'entretien";
    }
    return "";
  };

  const setupEmailHelper = (form, emailInput, index) => {
    if (!emailInput) {
      return;
    }

    let suggestionList = form.querySelector(".lead-email-suggestions");
    if (!suggestionList) {
      suggestionList = document.createElement("datalist");
      suggestionList.className = "lead-email-suggestions";
      form.appendChild(suggestionList);
    }

    if (!suggestionList.id) {
      suggestionList.id = `lead-email-suggestions-${index}`;
    }
    emailInput.setAttribute("list", suggestionList.id);

    const updateSuggestions = () => {
      const rawValue = emailInput.value.trim();
      const localPart = rawValue.includes("@") ? rawValue.split("@")[0] : rawValue;

      suggestionList.innerHTML = "";
      if (!localPart || localPart.length < 2) {
        return;
      }

      EMAIL_DOMAINS.forEach((domain) => {
        const option = document.createElement("option");
        option.value = `${localPart}@${domain}`;
        suggestionList.appendChild(option);
      });
    };

    emailInput.addEventListener("input", updateSuggestions);
    emailInput.addEventListener("blur", () => {
      const value = emailInput.value.trim();
      if (!value) {
        return;
      }
      if (!value.includes("@")) {
        emailInput.value = `${value}@gmail.com`;
      }
    });
  };

  const setupPhonePrefix = (phoneInput) => {
    if (!phoneInput) {
      return;
    }

    const prefix = phoneInput.dataset.phonePrefix || "+41 ";

    const ensurePrefix = () => {
      const value = (phoneInput.value || "").trimStart();
      if (!value) {
        phoneInput.value = prefix;
        return;
      }
      if (value.startsWith(prefix.trim())) {
        phoneInput.value = value.startsWith(prefix) ? value : `${prefix}${value.slice(prefix.trim().length).trimStart()}`;
        return;
      }
      if (value.startsWith("+41")) {
        phoneInput.value = `${prefix}${value.slice(3).trimStart()}`;
        return;
      }
      phoneInput.value = `${prefix}${value}`;
    };

    if (!(phoneInput.value || "").trim()) {
      phoneInput.value = prefix;
    } else {
      ensurePrefix();
    }

    phoneInput.addEventListener("focus", () => {
      if (!(phoneInput.value || "").trim()) {
        phoneInput.value = prefix;
      }
      ensurePrefix();
    });

    phoneInput.addEventListener("blur", ensurePrefix);

    phoneInput.addEventListener("keydown", (event) => {
      if (event.key !== "Backspace" && event.key !== "Delete") {
        return;
      }
      const start = phoneInput.selectionStart ?? 0;
      const end = phoneInput.selectionEnd ?? 0;
      if (start <= prefix.length && end <= prefix.length) {
        event.preventDefault();
      }
    });
  };

  const setupServicePreset = (serviceSelect) => {
    if (!serviceSelect || serviceSelect.value) {
      return;
    }
    const inferred = inferServiceFromPath();
    if (!inferred) {
      return;
    }
    const optionExists = Array.from(serviceSelect.options).some((option) => option.value === inferred);
    if (optionExists) {
      serviceSelect.value = inferred;
    }
  };

  const buildMailtoUrl = (to, subject, body) => {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const collectFieldValue = (form, fieldName) => {
    const field = form.elements.namedItem(fieldName);
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
      return "";
    }
    return field.value.trim();
  };

  const collectLabeledFields = (form) => {
    const lines = [];
    const labeledFields = form.querySelectorAll("[data-mail-label]");

    labeledFields.forEach((field) => {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
        return;
      }
      const label = (field.dataset.mailLabel || "").trim();
      const value = (field.value || "").trim();
      if (!label || !value) {
        return;
      }
      lines.push(`${label}: ${value}`);
    });

    return lines;
  };

  document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".js-mailto-form");

    forms.forEach((form, index) => {
      const to = form.dataset.mailto || MAIL_TO_DEFAULT;
      const emailInput = form.querySelector("input[name='email'][data-email-helper]");
      const phoneInput = form.querySelector("input[name='telephone'][data-phone-prefix]");
      const serviceSelect = form.querySelector("select[name='service'][data-service-select]");

      setupEmailHelper(form, emailInput, index);
      setupPhonePrefix(phoneInput);
      setupServicePreset(serviceSelect);

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (emailInput) {
          const value = emailInput.value.trim();
          if (value && !value.includes("@")) {
            emailInput.value = `${value}@gmail.com`;
          }
        }

        if (!form.reportValidity()) {
          return;
        }

        const nom = collectFieldValue(form, "nom");
        const email = collectFieldValue(form, "email");
        const telephone = collectFieldValue(form, "telephone");
        const service = collectFieldValue(form, "service");
        const message = collectFieldValue(form, "message");
        const labeledFields = collectLabeledFields(form);

        const subject = `Demande ${service || "projet"} - Colors Custom`;
        const body = [
          "Bonjour Colors Custom,",
          "",
          "Je souhaite vous contacter au sujet de mon projet.",
          "",
          `Nom: ${nom}`,
          `Email: ${email}`,
          `Téléphone: ${telephone}`,
          `Service: ${service || "Non précisé"}`,
          ...labeledFields,
          "",
          "Message:",
          message,
          "",
          `Page source: ${window.location.href}`
        ].join("\n");

        window.location.href = buildMailtoUrl(to, subject, body);
      });
    });
  });
})();
