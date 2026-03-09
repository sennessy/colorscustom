(() => {
  const section = document.getElementById("home-faq");
  const menu = document.getElementById("homeFaqMenu");
  const panel = document.getElementById("homeFaqPanel");
  const panelWrap = document.getElementById("homeFaqPanelWrap");
  if (!section || !menu || !panel || !panelWrap) return;

  const data = {
    services: {
      title: "SERVICES",
      items: [
        {
          q: "Quels services de protection automobile proposez-vous ?",
          a: "On propose des solutions complètes de protection esthétique et durable pour véhicules: PPF, traitements céramiques, vitres teintées et protection intérieure."
        },
        { q: "Le PPF protège-t-il vraiment contre les impacts ?", a: "Oui, le PPF absorbe les impacts légers et protège la peinture d'origine." },
        { q: "Combien de temps dure l'installation ?", a: "Selon le service, l'intervention prend entre quelques heures et plusieurs jours." },
        { q: "Proposez-vous des protections partielles ou uniquement complètes ?", a: "Nous proposons les deux formats selon le besoin et le budget." },
        { q: "Est-ce que vos services sont adaptés à tous types de véhicules ?", a: "Oui, nous adaptons chaque pose à la carrosserie et à l'usage du véhicule." },
        { q: "Pourquoi faire appel à des professionnels plutôt qu'à un kit maison ?", a: "La pose pro assure un résultat propre, durable et garanti." }
      ]
    },
    produits: {
      title: "PRODUITS",
      items: [
        { q: "Quelle marque de film utilisez-vous ?", a: "Nous utilisons des films premium reconnus pour leur durabilité et leur clarté." },
        { q: "Le film jaunit-il avec le temps ?", a: "Non, nos films sont traités anti-UV et résistent au jaunissement." },
        { q: "Le film est-il visible sur la carrosserie ?", a: "Le rendu est discret, avec une finition nette après pose." },
        { q: "Est-ce compatible avec les peintures mates ou satinées ?", a: "Oui, nous avons des solutions dédiées à ces finitions." },
        { q: "Vos films et traitements sont-ils compatibles avec toutes les couleurs de peinture ?", a: "Oui, ils sont compatibles avec la plupart des teintes et finitions." },
        { q: "Utilisez-vous des produits chimiques agressifs pour l'application ?", a: "Non, nous travaillons avec des produits adaptés et contrôlés." }
      ]
    },
    entreprises: {
      title: "ENTREPRISES & PROFESSIONNELS",
      items: [
        { q: "Travaillez-vous avec des flottes ou des entreprises ?", a: "Oui, nous accompagnons les flottes et véhicules professionnels." },
        { q: "Proposez-vous des solutions pour véhicules neufs ?", a: "Oui, nous pouvons intervenir dès la livraison." },
        { q: "Offrez-vous une garantie ?", a: "Oui, selon le type de protection appliquée." },
        { q: "Proposez-vous des tarifs spécifiques pour les flottes d'entreprise ?", a: "Oui, des grilles dédiées sont prévues selon les volumes." },
        { q: "Pouvez-vous intervenir directement dans nos locaux ou garages partenaires ?", a: "Selon le projet, oui. Nous définissons cela ensemble." },
        { q: "Vos solutions sont-elles adaptées aux véhicules utilitaires ou commerciaux ?", a: "Oui, utilitaires et véhicules commerciaux sont couverts." }
      ]
    },
    entretien: {
      title: "ENTRETIEN & DURABILITE",
      items: [
        { q: "Comment entretenir un véhicule protégé par PPF ou céramique ?", a: "Lavage doux régulier et produits adaptés prolongent la protection." },
        { q: "Les micro-rayures disparaissent-elles vraiment ?", a: "Certaines protections ont des propriétés d'auto-régénération sur rayures légères." },
        { q: "Le film peut-il être retiré ?", a: "Oui, il peut être retiré proprement par un professionnel." },
        { q: "Le PPF ou le traitement céramique protège-t-il contre les tâches et contaminants ?", a: "Oui, il réduit l'accroche des contaminants et facilite l'entretien." },
        { q: "Combien de temps dure l'effet de protection si je ne fais pas d'entretien régulier ?", a: "La durée baisse sans entretien; un suivi simple est recommandé." },
        { q: "Puis-je laver mon véhicule en station automatique ?", a: "Nous recommandons plutôt un lavage doux pour préserver le rendu." }
      ]
    },
    devis: {
      title: "DEVIS & RENDEZ-VOUS",
      items: [
        { q: "Combien de temps prend l'élaboration d'un devis ?", a: "En général, le devis est envoyé sous 24 à 48 heures." },
        { q: "Est-il possible de modifier mon rendez-vous ?", a: "Oui, selon les disponibilités de planning." },
        { q: "Faut-il apporter des documents ou informations spécifiques pour le rendez-vous ?", a: "Photos, modèle et attentes suffisent pour démarrer efficacement." },
        { q: "Proposez-vous des rendez-vous urgents ?", a: "Selon les périodes, des créneaux rapides peuvent être proposés." },
        { q: "Comment se déroule le processus après le devis ?", a: "Validation, planification, intervention puis contrôle final." },
        { q: "Le paiement se fait-il avant ou après l'intervention ?", a: "Le paiement suit les modalités annoncées lors du devis." }
      ]
    },
    innovation: {
      title: "INNOVATION & PERSONNALISATION",
      items: [
        { q: "Quels éléments de mon véhicule peuvent être personnalisés avec vos protections ?", a: "Carrosserie, feux, vitres, détails intérieurs et éléments visuels." },
        { q: "Proposez-vous des films avec des finitions spécifiques ou des textures uniques ?", a: "Oui, plusieurs finitions et textures sont disponibles." },
        { q: "Puis-je choisir la zone exacte de protection selon mon style de conduite ?", a: "Oui, nous adaptons la couverture à votre usage réel." },
        { q: "Vos solutions permettent-elles d'ajouter des logos ou motifs sur le film ?", a: "Oui, selon le projet, nous intégrons logos et motifs." },
        { q: "Comment adaptez-vous vos produits aux couleurs et reflets particuliers de ma peinture ?", a: "Nous faisons des choix de finition après étude de la teinte." },
        { q: "Offrez-vous des conseils sur la meilleure combinaison de protections pour mon véhicule ?", a: "Oui, nous proposons une recommandation complète et sur mesure." }
      ]
    }
  };

  const setItemState = (row, open) => {
    row.classList.toggle("is-open", open);
    const question = row.querySelector(".home-faq__question");
    const answer = row.querySelector(".home-faq__answer");
    if (question) question.setAttribute("aria-expanded", open ? "true" : "false");
    if (answer) answer.hidden = !open;
  };

  const closePanel = () => {
    section.classList.remove("is-panel-open");
    menu.querySelectorAll(".home-faq__cat").forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
    });
    panel.hidden = true;
    panel.innerHTML = "";
  };

  const toggleItem = (itemEl) => {
    const isOpen = itemEl.classList.contains("is-open");
    panel.querySelectorAll(".home-faq__item").forEach((el) => setItemState(el, false));
    if (!isOpen) setItemState(itemEl, true);
  };

  const renderPanel = (cat) => {
    const block = data[cat];
    if (!block) return;

    panel.hidden = false;
    panel.innerHTML = "";

    const title = document.createElement("h3");
    title.className = "home-faq__panel-title";
    title.textContent = block.title;
    panel.appendChild(title);

    block.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "home-faq__item";

      const q = document.createElement("button");
      const questionId = `home-faq-${cat}-q-${index}`;
      const answerId = `home-faq-${cat}-a-${index}`;
      q.type = "button";
      q.className = "home-faq__question";
      q.id = questionId;
      q.textContent = `▸ ${item.q}`;
      q.setAttribute("aria-expanded", "false");
      q.setAttribute("aria-controls", answerId);

      const a = document.createElement("div");
      const text = document.createElement("p");
      a.className = "home-faq__answer";
      a.id = answerId;
      a.setAttribute("role", "region");
      a.setAttribute("aria-labelledby", questionId);
      a.hidden = true;
      text.textContent = item.a;
      a.appendChild(text);

      q.addEventListener("click", () => toggleItem(row));

      row.appendChild(q);
      row.appendChild(a);
      panel.appendChild(row);
    });
  };

  menu.querySelectorAll(".home-faq__cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-faq-cat");
      if (!cat || !data[cat]) return;
      const alreadyOpen = btn.classList.contains("is-active");

      if (alreadyOpen) {
        closePanel();
        return;
      }

      menu.querySelectorAll(".home-faq__cat").forEach((el) => {
        el.classList.remove("is-active");
        el.setAttribute("aria-expanded", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-expanded", "true");
      renderPanel(cat);
      section.classList.add("is-panel-open");
    });
  });

  const back = panelWrap.querySelector(".home-faq__back");
  if (back) {
    back.addEventListener("click", closePanel);
  }

  panel.hidden = true;
})();
