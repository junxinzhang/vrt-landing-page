(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!menuToggle || !navLinks) {
      return;
    }
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
    body.classList.remove('nav-open');
  };

  const openMenu = () => {
    if (!menuToggle || !navLinks) {
      return;
    }
    menuToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('is-open');
    body.classList.add('nav-open');
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!navLinks.classList.contains('is-open')) {
        return;
      }
      if (navLinks.contains(target) || menuToggle.contains(target)) {
        return;
      }
      closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  }

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  const faqButtons = Array.from(document.querySelectorAll('.faq-question'));
  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) {
        return;
      }
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('is-open', !expanded);
    });
  });

  const sectionIds = ['hero', 'value', 'scenarios', 'features', 'screenshots', 'faq'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => Boolean(section));

  const setActiveLink = (id) => {
    navAnchors.forEach((anchor) => {
      const targetId = anchor.getAttribute('href')?.slice(1);
      anchor.classList.toggle('active', targetId === id);
    });
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -45% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  } else {
    setActiveLink('hero');
  }

  const updateHeaderState = () => {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
})();
