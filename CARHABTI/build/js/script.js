document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.querySelector('loading-component');
  const loadingScreenRoot = loadingScreen.shadowRoot || loadingScreen.attachShadow({ mode: 'open' });
  const load = loadingScreenRoot.querySelector('.loading-screen');
  darckMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  darckMode ? load.style.background = '#1b1e26' : load.style.background = 'white';
  darckMode ? load.style.color = '#eaeaea' : load.style.color = 'black'; 

  if (loadingScreen && loadingScreen.hide) {
    window.addEventListener('load', () => {
      loadingScreen.hide();
    });
  }
  const header = document.querySelector('header-component');
  const footer = document.querySelector('footer-component');
  const sideNav = document.querySelector('side-nav-component');
  if (!header || !footer || !sideNav) return;

  const headerRoot = header.shadowRoot || header.attachShadow({ mode: 'open' });
  const footerRoot = footer.shadowRoot || footer.attachShadow({ mode: 'open' });
  const sideNavRoot = sideNav.shadowRoot || sideNav.attachShadow({ mode: 'open' });

  const button = headerRoot.getElementById('nav-btn');
  const closeBtn = sideNavRoot.querySelector('.close-btn');
  const section = sideNavRoot.getElementById('side-nav');
  const userNav = headerRoot.getElementById('user-nav');
  const loginNav = headerRoot.getElementById('login');
  const userName = headerRoot.getElementById('user');
  const sideUserNav = sideNavRoot.getElementById('user-side-nav');
  const sideloginNav = sideNavRoot.getElementById('side-login');
  const sideUserName = sideNavRoot.getElementById('user-side');


  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';


  const nav = headerRoot.querySelectorAll('.main-nav ul li');
  const logNav = headerRoot.querySelectorAll('.login ul li');
  nav.forEach(element => {
    element.classList.remove('a-reverse', 'reverse-btn');
  });

  const relativePath = window.location.pathname + window.location.hash;
  const setActiveNav = () => {
    nav.forEach(element => {
      element.classList.remove('a-reverse', 'reverse-btn');
    });
    logNav.forEach(element => {
      element.classList.remove('a-reverse', 'reverse-btn');
    });
    const agenceRect = document.getElementById('agence')?.getBoundingClientRect();
    const contactRect = footerRoot.getElementById('contact-form')?.getBoundingClientRect();
    
    if (agenceRect && agenceRect.top < window.innerHeight / 2 && agenceRect.bottom > window.innerHeight / 2) {
      nav[2].classList.add('a-reverse', 'reverse-btn');
      logNav[1].classList.add('a-reverse', 'reverse-btn');
    }else if (contactRect && contactRect.top < window.innerHeight && contactRect.bottom > 0) {
      nav[3].classList.add('a-reverse', 'reverse-btn');
      switch (relativePath) {
        case '/carhabti/CARHABTI/login.html':
          logNav[0].classList.add('a-reverse', 'reverse-btn');
          break;
        default:
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          break;
      }
    } else {
      switch (relativePath) {
        case '/carhabti/CARHABTI/reservation.html':
          nav[1].classList.add('a-reverse', 'reverse-btn');
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          break;
        case '/carhabti/CARHABTI/main.html':
          nav[0].classList.add('a-reverse', 'reverse-btn');
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          break;
        case '/carhabti/CARHABTI/main.html#top':
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          nav[0].classList.add('a-reverse', 'reverse-btn');
          break;
        case '/carhabti/CARHABTI/login.html':
          logNav[0].classList.add('a-reverse', 'reverse-btn');
          break;
        case '/carhabti/CARHABTI/signup.html':
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          break;
        default:
          nav[0].classList.add('a-reverse', 'reverse-btn');
          logNav[1].classList.add('a-reverse', 'reverse-btn');
          break
      }
    }
  };

  setActiveNav();
  window.addEventListener('scroll', setActiveNav);

  if (isLoggedIn) {
    userNav.classList.remove('hidden');
    loginNav.classList.remove('flex');
    userNav.classList.add('flex');
    loginNav.classList.add('hidden');
    sideUserNav.classList.remove('hidden');
    sideloginNav.classList.add('hidden');
    userName.textContent = localStorage.getItem('userName') || 'User';
    sideUserName.textContent = localStorage.getItem('userName') || 'User';
  } else {
    userNav.classList.add('hidden');
    loginNav.classList.add('flex');
    userNav.classList.remove('flex');
    loginNav.classList.remove('hidden');
    sideUserNav.classList.add('hidden');
    sideloginNav.classList.remove('hidden');
  }

  if (button && closeBtn && section) {
    button.addEventListener('click', () => {
      section.style.display = 'flex';
      button.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
      section.classList.add('fadeout');
      setTimeout(() => {
        section.style.display = 'none';
        section.classList.remove('fadeout');
        button.style.display = 'block';
      }, 200);
    });
  }

  const main = document.querySelector('.main');
  const footerEl = footerRoot.querySelector('.footer');
  const handleOutsideClick = () => {
    button.style.display = window.innerWidth > 760 ? 'none' : 'block';
    if (section && section.style.display === 'flex') {
      section.classList.add('fadeout');
      setTimeout(() => {
        section.style.display = 'none';
        section.classList.remove('fadeout');
        button.style.display = 'block';
      }, 200);
    }
  };

  if (main) main.addEventListener('click', handleOutsideClick);
  if (footerEl) footerEl.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', handleOutsideClick);

  const map = document.getElementById('mapview');
  if (map) {
    window.togglemap = () => {
      map.style.display = map.style.display === 'none' || map.style.display === '' ? 'flex' : 'none';
    };
  }
});