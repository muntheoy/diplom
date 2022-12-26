window.addEventListener('load', function () {
    try {
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
    } catch(error) {
      console.error('Ошибка обрабочика: ', error);
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