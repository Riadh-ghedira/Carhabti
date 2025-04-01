document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.querySelector('loading-component');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      loadingScreen.hide();
    });
  }

  const header = document.querySelector('header-component');
  const footer = document.querySelector('footer-component');
  const sideNav = document.querySelector('side-nav-component');
  const headerRoot = header.shadowRoot || header.attachShadow({ mode: 'open' });
  const footerRoot =
    footer.shadowRoot || footer.attachShadow({ mode: 'open' });
  const sideNavRoot =
    sideNav.shadowRoot || sideNav.attachShadow({ mode: 'open' });
  const button = headerRoot.getElementById('nav-btn');
  const closeBtn = sideNavRoot.querySelector('.close-btn');
  const section = sideNavRoot.getElementById('side-nav');
  if (header && sideNav) {
    button.addEventListener('click', function (e) {
      if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'flex';
        button.style.display = 'none';
      }
    });
    closeBtn.addEventListener('click', function (e) {
      if (section.style.display === 'flex') {
        section.classList.add('fadeout');
        setTimeout(() => {
          section.style.display = 'none';
          section.classList.remove('fadeout');
          button.style.display = 'block';
        }, 200);
      }
    });
  }
  const main = document.querySelector('.main');
  const footerEl = footerRoot.querySelector('.footer');
  function handleOutsideClick() {
    if (window.innerWidth > 760) {
      button.style.display = 'none';
    }
    else {
      button.style.display = 'block';
    }
    if (section.style.display === 'flex') {
      section.classList.add('fadeout');
      setTimeout(() => {
        section.style.display = 'none';
        section.classList.remove('fadeout');
        button.style.display = 'block';
      }, 200);
    }
  }
  footerEl.addEventListener('click', handleOutsideClick);
  main.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', handleOutsideClick);

});
const map = document.getElementById('mapview');
function togglemap() {
  if (map.style.display === 'none' || map.style.display === '') {
    map.style.display = 'flex';
  } else {
    map.style.display = 'none';
  }
};

