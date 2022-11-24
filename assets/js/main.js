window.addEventListener('load', function () {
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
});