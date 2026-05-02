window.addEventListener('load', function () {
    try {
      ensureSharedStyles();
      renderHeader();
      syncHeaderOffset();
      const scroll_btn = document.querySelector('#scroll_btn');
      scroll_btn.addEventListener('click', () => {
            const html = document.querySelector('html');
            html.scrollTop = '0';
        });
    
      const html_element = document.querySelector('html');
      window.addEventListener('scroll', () => {
        if ( html_element.scrollTop > (html_element.offsetHeight/2) ) {
          scroll_btn.classList.remove('hidden');
        } else {
          scroll_btn.classList.add('hidden');
        };
      });
      window.addEventListener('resize', syncHeaderOffset);

      const toggleThemeBtn = document.querySelector('#toggle_theme');
      let browser = 'Chrome';
      if (new RegExp(/Firefox/i).test(navigator.userAgent)) {
        browser = 'Firefox';
        if (toggleThemeBtn) {
          toggleThemeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const currentTheme = getCookie('theme');
            const bodyElement = document.querySelector('body');
            if (currentTheme === 'dark') {
              bodyElement.classList.remove('dark');
              setCookie('theme', 'light', {secure: true, 'max-age': 2592000, samesite: 'strict'});
            } else {
              bodyElement.classList.add('dark');
              setCookie('theme', 'dark', {secure: true, 'max-age': 2592000, samesite: 'strict'});
            };
          });
        };
      } else if (new RegExp(/Chrome/i).test(navigator.userAgent)) {
        browser = 'Chrome';
        if (toggleThemeBtn) {
          toggleThemeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const currentTheme = localStorage.getItem('theme');
            const bodyElement = document.querySelector('body');
            if (currentTheme === 'dark') {
              bodyElement.classList.remove('dark');
              localStorage.setItem('theme', 'light');
            } else {
              bodyElement.classList.add('dark');
              localStorage.setItem('theme', 'dark');
            };
          });
        };
      } else {
        toggleThemeBtn.classList.add('hidden');
      };

      function applyTheme(isDark) {
        const bodyElement = document.querySelector('body');
        if (isDark) {
          bodyElement.classList.add('dark');
        } else {
          bodyElement.classList.remove('dark');
        };
        if (browser === 'Firefox') {
          setCookie('theme', isDark ? 'dark' : 'light', {secure: true, 'max-age': 2592000, samesite: 'strict'});
        } else if (browser === 'Chrome') {
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
      };

      const lightThemeBtn = document.querySelector('#toggle_theme_light');
      const darkThemeBtn = document.querySelector('#toggle_theme_dark');
      if (browser !== 'Firefox' && browser !== 'Chrome') {
        const actionsEl = document.querySelector('.header-actions');
        if (actionsEl) actionsEl.classList.add('hidden');
      };
      if (lightThemeBtn) lightThemeBtn.addEventListener('click', () => applyTheme(false));
      if (darkThemeBtn) darkThemeBtn.addEventListener('click', () => applyTheme(true));

      new MutationObserver(() => {
        const dark = document.body.classList.contains('dark');
        const li = document.querySelector('#theme-item-light');
        const di = document.querySelector('#theme-item-dark');
        if (li) li.classList.toggle('navbar__items_active', !dark);
        if (di) di.classList.toggle('navbar__items_active', dark);
      }).observe(document.body, {attributes: true, attributeFilter: ['class']});
    } catch(error) {
      console.error('Ошибка обрабочика: ', error);
    };

    function renderHeader() {
      const headerElement = document.querySelector('#header');
      if (!headerElement) return;
      const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
      const activeMenu = getActiveMenu(pathname);
      const navigationItems = [{
        key: 'search',
        href: '../../pages/main/index.html',
        text: '\u041f\u043e\u0438\u0441\u043a'
      }, {
        key: 'department',
        href: '../../pages/departments/index.html',
        text: '\u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u044f'
      }, {
        key: 'plan',
        href: '../../pages/plan/index.html',
        text: '\u041f\u043b\u0430\u043d'
      }, {
        key: 'help',
        href: '../../pages/help/index.html',
        text: '\u041f\u043e\u043c\u043e\u0449\u044c'
      }];
      const navigationHTML = navigationItems.map(item => {
        const activeClass = item.key === activeMenu ? ' navbar__items_active' : '';
        return `<li class="navbar__items${activeClass}" data-partition-menu="${item.key}" onselectstart="return false" onmousedown="return false"><a class="navbar__link" href="${item.href}"><span class="navbar__icon navbar__icon_${item.key}" aria-hidden="true"></span><span class="navbar__text">${item.text}</span></a></li>`;
      }).join('');
      const isDark = document.body.classList.contains('dark');
      headerElement.innerHTML = `<div class="container"><div class="header-wrap"><a class="logo" href="../../pages/main/index.html"><span class="logo__img-block"><img class="logo__img" src="../../assets/img/Header/logo-ckba.svg" onselectstart="return false"></span><div class="logo__info-block"><span class="logo__factory-discription hidden" onselectstart="return false" onmousedown="return false"></span><div class="logo__factory-name hidden" onselectstart="return false" onmousedown="return false"><div class="logo__version"></div></div></div></a><nav class="navbar"><ul class="navbar__list">${navigationHTML}</ul></nav><div class="header-actions"><ul class="navbar__list theme-switcher-list"><li class="navbar__items theme-toggle-item${isDark ? '' : ' navbar__items_active'}" id="theme-item-light"><button id="toggle_theme_light" class="navbar__link theme-btn" type="button" title="Светлая тема"><i class="fa fa-sun-o" aria-hidden="true"></i></button></li><li class="navbar__items theme-toggle-item${isDark ? ' navbar__items_active' : ''}" id="theme-item-dark"><button id="toggle_theme_dark" class="navbar__link theme-btn" type="button" title="Тёмная тема"><i class="fa fa-moon-o" aria-hidden="true"></i></button></li></ul></div></div></div>`;
    };

    function getActiveMenu(pathname) {
      if (pathname.includes('/pages/departments/')) return 'department';
      if (pathname.includes('/pages/plan/')) return 'plan';
      if (pathname.includes('/pages/help/') || pathname.includes('/pages/changing/') || pathname.includes('/pages/faq/') || pathname.includes('/pages/information/') || pathname.includes('/pages/it-service-desk/') || pathname.includes('/pages/support/') || pathname.includes('/pages/mailing/') || pathname.includes('/pages/versions/') || pathname.includes('/pages/emergency/')) return 'help';
      return 'search';
    };

    function syncHeaderOffset() {
      const headerElement = document.querySelector('#header');
      if (!headerElement) return;
      document.body.style.paddingTop = `${headerElement.offsetHeight}px`;
    };

    function ensureSharedStyles() {
      const stylePath = '../../assets/css/tokens.css';
      const comparePath = '/assets/css/tokens.css';
      const styleExists = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(item => {
        const href = item.getAttribute('href') || '';
        return href === stylePath || href.endsWith(comparePath);
      });
      if (styleExists) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylePath;
      document.head.appendChild(link);
    };

    function setCookie(name, value, options = {}) {
      options.path = '/';
  
      if (options.expires) {
        options.expires = options.expires.toUTCString();
      };
  
      let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
      for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        };
      };
      document.cookie = updatedCookie;
    };

    function getCookie(name) {
      let matches = document.cookie.match( new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    };
});
