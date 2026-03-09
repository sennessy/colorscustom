(() => {
  const links = Array.from(document.querySelectorAll('.cc-nav__link[data-nav]'));
  if (!links.length) return;
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
    const insideNav = event.target instanceof Node && event.target.closest('.cc-nav');
    if (!insideNav) closeAllGroups();
  });

  document.addEventListener('focusin', (event) => {
    const insideNav = event.target instanceof Node && event.target.closest('.cc-nav');
    if (!insideNav) closeAllGroups();
  });

  mobileMedia.addEventListener('change', (event) => {
    if (!event.matches) closeAllGroups();
  });
})();
