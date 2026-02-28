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

  const injectScript = (src, attributes = {}) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.src = src;

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === true) {
        script.setAttribute(key, '');
      } else {
        script.setAttribute(key, String(value));
      }
    });

    document.head.appendChild(script);
  };

  if (!Array.isArray(window._hmt)) {
    window._hmt = [];
  }
  injectScript('https://hm.baidu.com/hm.js?ca2efa711b1a5fefdd03ba4355a49406');

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-2Y9RHGQ0TG');
  }
  injectScript('https://www.googletagmanager.com/gtag/js?id=G-2Y9RHGQ0TG', { async: true });

  injectScript('https://cloud.umami.is/script.js', {
    defer: true,
    'data-website-id': 'df2642a3-5ba6-4d9f-8609-060fd2d69e38'
  });

  const primaryHeroAction = document.querySelector('#hero .hero-actions .btn-primary');
  if (primaryHeroAction instanceof HTMLAnchorElement) {
    primaryHeroAction.id = 'download-macos';
    primaryHeroAction.href = 'downloads/VoiceTranslation.dmg';
    primaryHeroAction.target = '_blank';
    primaryHeroAction.rel = 'noopener';
    primaryHeroAction.dataset.trackDownload = 'true';
    primaryHeroAction.dataset.downloadLabel = 'VoiceTranslation.dmg';
    primaryHeroAction.dataset.downloadPlatform = 'macos';
    primaryHeroAction.textContent = '下载 macOS DMG';
  }

  const trackDownloadClick = (link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const href = link.getAttribute('href') || '';
    const linkUrl = new URL(href, window.location.href);
    const fileName = link.dataset.downloadLabel || linkUrl.pathname.split('/').pop() || href;
    const platform = link.dataset.downloadPlatform || 'unknown';
    const linkText = (link.textContent || '').trim();

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_click', {
        file_name: fileName,
        file_extension: fileName.includes('.') ? fileName.split('.').pop() : '',
        link_url: linkUrl.href,
        link_text: linkText,
        platform
      });
    }

    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track('download_click', {
        file_name: fileName,
        link_url: linkUrl.href,
        link_text: linkText,
        platform
      });
    }

    if (Array.isArray(window._hmt)) {
      window._hmt.push(['_trackEvent', 'download', platform, fileName]);
    }
  };

  const downloadLinks = Array.from(
    document.querySelectorAll('a[data-track-download], a[href$=".dmg"], a[href$=".zip"], a[href*="/downloads/"]')
  );

  downloadLinks.forEach((link) => {
    link.addEventListener('click', () => {
      trackDownloadClick(link);
    });
  });
})();
