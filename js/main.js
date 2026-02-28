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

  let primaryDownloadFileName = 'VoiceTranslation.dmg';
  let primaryDownloadPlatform = 'macos';
  const primaryHeroAction = document.querySelector('#hero .hero-actions .btn-primary');
  if (primaryHeroAction instanceof HTMLAnchorElement) {
    primaryHeroAction.id = 'download-macos';
    primaryHeroAction.href = 'downloads/VoiceTranslation.dmg';
    primaryHeroAction.target = '_blank';
    primaryHeroAction.rel = 'noopener';
    primaryHeroAction.dataset.trackDownload = 'true';
    primaryHeroAction.dataset.downloadLabel = primaryDownloadFileName;
    primaryHeroAction.dataset.downloadPlatform = primaryDownloadPlatform;
    primaryHeroAction.textContent = '下载 macOS DMG';
  }

  const countApiBaseUrl = 'https://api.countapi.xyz';
  const countApiNamespace = 'vrt-junxinzhang-com';
  const totalDownloadCountKey = 'download-clicks-total';
  const uniqueDownloadUserKey = 'download-users-unique';
  const uniqueDownloadStorageKey = 'vrt-download-user-counted-v1';

  const sanitizeCounterKey = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const primaryDownloadCounterKey = sanitizeCounterKey(`${primaryDownloadPlatform}-${primaryDownloadFileName}`);
  const primaryDownloadCountKey = `download-clicks-${primaryDownloadCounterKey}`;
  const primaryUniqueCountKey = `download-users-${primaryDownloadCounterKey}`;

  const buildCounterUrl = (action, key) =>
    `${countApiBaseUrl}/${action}/${encodeURIComponent(countApiNamespace)}/${encodeURIComponent(key)}`;

  const pingCounter = (key) => {
    const url = `${buildCounterUrl('hit', key)}?t=${Date.now()}`;

    if (typeof window.fetch === 'function') {
      window.fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        keepalive: true
      }).catch(() => {});
      return;
    }

    const image = new Image();
    image.referrerPolicy = 'no-referrer';
    image.src = url;
  };

  const fetchCounterValue = async (key) => {
    const response = await window.fetch(`${buildCounterUrl('get', key)}?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`counter_${response.status}`);
    }

    const payload = await response.json();
    return typeof payload.value === 'number' ? payload.value : 0;
  };

  window.vrtDownloadStats = {
    totalDownloads: buildCounterUrl('get', totalDownloadCountKey),
    uniqueDownloadUsers: buildCounterUrl('get', uniqueDownloadUserKey),
    fileDownloads: buildCounterUrl('get', primaryDownloadCountKey),
    fileUniqueUsers: buildCounterUrl('get', primaryUniqueCountKey)
  };

  const trackCountApiDownload = ({ fileName, platform }) => {
    const fileKey = sanitizeCounterKey(`${platform}-${fileName}`);
    const fileDownloadCountKey = `download-clicks-${fileKey}`;
    const fileUniqueStorageKey = `${uniqueDownloadStorageKey}:${fileKey}`;
    const fileUniqueCountKey = `download-users-${fileKey}`;

    pingCounter(totalDownloadCountKey);
    pingCounter(fileDownloadCountKey);

    try {
      if (!window.localStorage.getItem(uniqueDownloadStorageKey)) {
        window.localStorage.setItem(uniqueDownloadStorageKey, String(Date.now()));
        pingCounter(uniqueDownloadUserKey);
      }

      if (!window.localStorage.getItem(fileUniqueStorageKey)) {
        window.localStorage.setItem(fileUniqueStorageKey, String(Date.now()));
        pingCounter(fileUniqueCountKey);
      }
    } catch (error) {
      // Storage can be blocked in privacy modes; total downloads are still counted.
    }
  };

  const createDownloadStatsPanel = () => {
    const panel = document.createElement('aside');
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:120',
      'width:min(320px,calc(100vw - 32px))',
      'padding:16px',
      'border-radius:16px',
      'background:rgba(15,23,42,0.96)',
      'border:1px solid rgba(148,163,184,0.3)',
      'box-shadow:0 18px 42px rgba(15,23,42,0.3)',
      'color:#e2e8f0',
      'font:14px/1.5 \"Noto Sans SC\",\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\",sans-serif'
    ].join(';');

    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;';

    const title = document.createElement('strong');
    title.textContent = '下载统计';
    title.style.cssText = 'font-size:15px;font-weight:700;';
    headerRow.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '关闭';
    closeButton.style.cssText = [
      'border:1px solid rgba(148,163,184,0.35)',
      'background:transparent',
      'color:#cbd5e1',
      'border-radius:999px',
      'padding:4px 10px',
      'cursor:pointer'
    ].join(';');
    headerRow.appendChild(closeButton);
    panel.appendChild(headerRow);

    const hint = document.createElement('p');
    hint.textContent = '三击页脚版权可开关，或直接在地址后加 ?stats=1。';
    hint.style.cssText = 'margin:8px 0 0;color:#94a3b8;font-size:12px;';
    panel.appendChild(hint);

    const status = document.createElement('p');
    status.textContent = '等待刷新';
    status.style.cssText = 'margin:10px 0 0;color:#cbd5e1;font-size:12px;';
    panel.appendChild(status);

    const list = document.createElement('div');
    list.style.cssText = 'margin-top:12px;display:grid;gap:10px;';

    const metricConfig = [
      ['总下载次数', 'totalDownloads'],
      ['总去重人数', 'uniqueDownloadUsers'],
      ['当前文件下载次数', 'fileDownloads'],
      ['当前文件去重人数', 'fileUniqueUsers']
    ];

    const metricValues = {};
    metricConfig.forEach(([label, key]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:12px;background:rgba(30,41,59,0.7);';

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.cssText = 'color:#cbd5e1;';
      row.appendChild(labelEl);

      const valueEl = document.createElement('strong');
      valueEl.textContent = '--';
      valueEl.style.cssText = 'color:#f8fafc;font-size:16px;';
      row.appendChild(valueEl);

      metricValues[key] = valueEl;
      list.appendChild(row);
    });
    panel.appendChild(list);

    const actionRow = document.createElement('div');
    actionRow.style.cssText = 'margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

    const refreshButton = document.createElement('button');
    refreshButton.type = 'button';
    refreshButton.textContent = '刷新';
    refreshButton.style.cssText = [
      'border:0',
      'background:#0f7bff',
      'color:#fff',
      'border-radius:10px',
      'padding:8px 12px',
      'font-weight:700',
      'cursor:pointer'
    ].join(';');
    actionRow.appendChild(refreshButton);

    const openLink = document.createElement('a');
    openLink.href = window.vrtDownloadStats.totalDownloads;
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.textContent = '查看 JSON';
    openLink.style.cssText = 'color:#7dd3fc;font-size:12px;';
    actionRow.appendChild(openLink);

    panel.appendChild(actionRow);
    document.body.appendChild(panel);

    return {
      panel,
      status,
      metricValues,
      refreshButton,
      closeButton
    };
  };

  const statsPanel = createDownloadStatsPanel();
  let statsPanelVisible = false;
  let statsPanelLoading = false;

  const refreshDownloadStatsPanel = async () => {
    if (statsPanelLoading) {
      return;
    }

    statsPanelLoading = true;
    statsPanel.refreshButton.disabled = true;
    statsPanel.refreshButton.style.opacity = '0.7';
    statsPanel.status.textContent = '正在刷新...';

    try {
      const [totalDownloads, uniqueDownloadUsers, fileDownloads, fileUniqueUsers] = await Promise.all([
        fetchCounterValue(totalDownloadCountKey),
        fetchCounterValue(uniqueDownloadUserKey),
        fetchCounterValue(primaryDownloadCountKey),
        fetchCounterValue(primaryUniqueCountKey)
      ]);

      statsPanel.metricValues.totalDownloads.textContent = String(totalDownloads);
      statsPanel.metricValues.uniqueDownloadUsers.textContent = String(uniqueDownloadUsers);
      statsPanel.metricValues.fileDownloads.textContent = String(fileDownloads);
      statsPanel.metricValues.fileUniqueUsers.textContent = String(fileUniqueUsers);
      statsPanel.status.textContent = `更新于 ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`;
    } catch (error) {
      statsPanel.status.textContent = '读取失败，请稍后重试';
    } finally {
      statsPanelLoading = false;
      statsPanel.refreshButton.disabled = false;
      statsPanel.refreshButton.style.opacity = '1';
    }
  };

  const setDownloadStatsPanelVisible = (visible) => {
    statsPanelVisible = visible;
    statsPanel.panel.hidden = !visible;

    if (visible) {
      refreshDownloadStatsPanel();
    }
  };

  window.vrtDownloadStatsPanel = {
    open: () => setDownloadStatsPanelVisible(true),
    close: () => setDownloadStatsPanelVisible(false),
    refresh: refreshDownloadStatsPanel
  };

  statsPanel.refreshButton.addEventListener('click', () => {
    refreshDownloadStatsPanel();
  });

  statsPanel.closeButton.addEventListener('click', () => {
    setDownloadStatsPanelVisible(false);
  });

  const footerToggleTarget = document.querySelector('.copyright');
  let footerToggleCount = 0;
  let footerToggleTimer = 0;
  if (footerToggleTarget) {
    footerToggleTarget.addEventListener('click', () => {
      footerToggleCount += 1;

      window.clearTimeout(footerToggleTimer);
      footerToggleTimer = window.setTimeout(() => {
        footerToggleCount = 0;
      }, 1200);

      if (footerToggleCount >= 3) {
        footerToggleCount = 0;
        setDownloadStatsPanelVisible(!statsPanelVisible);
      }
    });
  }

  const shouldOpenStatsPanel = (() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('stats') || params.get('downloadStats');
    if (!value) {
      return false;
    }

    return ['1', 'true', 'open', 'yes'].includes(value.toLowerCase());
  })();

  if (shouldOpenStatsPanel) {
    setDownloadStatsPanelVisible(true);
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

    trackCountApiDownload({ fileName, platform });

    if (statsPanelVisible) {
      window.setTimeout(() => {
        refreshDownloadStatsPanel();
      }, 500);
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
