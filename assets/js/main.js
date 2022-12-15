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
    } catch(error) {
      console.error('Ошибка обрабочика: ', error);
    };
});