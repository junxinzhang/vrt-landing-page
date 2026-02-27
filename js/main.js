(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const yearEl = document.getElementById('year');
  const revealNodes = Array.from(
    document.querySelectorAll('.hero-card, .card, .feature-list, .feature-panel, .shot-placeholder, .faq-item, .cta-inner')
  );

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!menuToggle || !navLinks) {
      return;
    }
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开导航菜单');
    navLinks.classList.remove('is-open');
    body.classList.remove('nav-open');
  };

  const openMenu = () => {
    if (!menuToggle || !navLinks) {
      return;
    }
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', '关闭导航菜单');
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

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
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
    setActiveLink('hero');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        rootMargin: '-38% 0px -45% 0px',
        threshold: [0, 0.2, 0.45, 0.7]
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  } else {
    setActiveLink('hero');
  }

  if (revealNodes.length > 0) {
    revealNodes.forEach((node, index) => {
      node.classList.add('will-reveal');
      node.style.transitionDelay = `${Math.min(index % 4, 3) * 40}ms`;
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.12
        }
      );

      revealNodes.forEach((node) => revealObserver.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add('is-revealed'));
    }
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
