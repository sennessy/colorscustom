(() => {
  const links = Array.from(document.querySelectorAll('.cc-nav__link[data-nav]'));
  if (!links.length) return;
  const header = document.querySelector('.cc-header');
  const nav = document.querySelector('.cc-nav');
  const navToggle = document.querySelector('.cc-nav-toggle');
  const skipLink = document.querySelector('.skip-link');
  const main = document.getElementById('main-content') || document.querySelector('main');
  if (skipLink && main) {
    if (!main.id) main.id = 'main-content';
    skipLink.setAttribute('href', `#${main.id}`);
  }

  const groups = Array.from(document.querySelectorAll('.cc-nav__group'));
  const mobileMedia = window.matchMedia('(max-width: 900px)');

  const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';

  let active = '';
  if (path === '/services' || path.startsWith('/services') || path.startsWith('/expertise') || path === '/tarifs') {
    active = 'services';
  } else if (path.startsWith('/boutique') || path === '/panier' || path.startsWith('/checkout')) {
    active = 'boutique';
  } else if (path.startsWith('/entreprise') || path === '/about' || path === '/approach' || path === '/clients') {
    active = 'entreprise';
  } else if (path === '/contact' || path === '/devis' || path === '/faq') {
    active = 'contact';
  }

  links.forEach((link) => {
    const isActive = link.dataset.nav === active;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const openGroup = (group) => {
    closeAllGroups(group);
    group.classList.add('is-open');
    const trigger = group.querySelector('.cc-nav__link');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };

  const closeAllGroups = (except = null) => {
    groups.forEach((group) => {
      if (group === except) return;
      group.classList.remove('is-open');
      const trigger = group.querySelector('.cc-nav__link');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const setMenuOpen = (open) => {
    if (!header || !navToggle) return;
    header.classList.toggle('is-menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('nav-open', open);
    if (!open) closeAllGroups();
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (!mobileMedia.matches) return;
      const willOpen = !header?.classList.contains('is-menu-open');
      setMenuOpen(willOpen);
    });

    navToggle.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      navToggle.blur();
    });
  }

  groups.forEach((group) => {
    const trigger = group.querySelector('.cc-nav__link');
    const submenu = group.querySelector('.cc-nav__submenu');
    if (!trigger || !submenu) return;

    trigger.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('role', 'menu');

    trigger.addEventListener('click', (event) => {
      if (!mobileMedia.matches) return;
      const isOpen = group.classList.contains('is-open');

      if (!isOpen) {
        event.preventDefault();
        setMenuOpen(true);
        openGroup(group);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllGroups();
        trigger.blur();
        return;
      }
      if (!['Enter', ' ', 'ArrowDown'].includes(event.key)) return;

      event.preventDefault();
      openGroup(group);
      const firstLink = submenu.querySelector('a');
      if (firstLink) firstLink.focus();
    });

    submenu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeAllGroups();
      trigger.focus();
    });
  });

  document.addEventListener('click', (event) => {
    const insideHeader = event.target instanceof Node && event.target.closest('.cc-header');
    if (!insideHeader) {
      closeAllGroups();
      setMenuOpen(false);
    }
  });

  document.addEventListener('focusin', (event) => {
    const insideHeader = event.target instanceof Node && event.target.closest('.cc-header');
    if (!insideHeader) {
      closeAllGroups();
      setMenuOpen(false);
    }
  });

  mobileMedia.addEventListener('change', (event) => {
    if (!event.matches) {
      closeAllGroups();
      setMenuOpen(false);
    }
  });

  nav?.addEventListener('click', (event) => {
    if (!mobileMedia.matches) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const clickedLink = target.closest('.cc-nav__submenu a, .cc-nav > .cc-nav__link[data-nav]');
    if (!clickedLink) return;
    setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setMenuOpen(false);
  });
})();
