class HeaderComponent extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  scroll-behavior: smooth;
                  font-family: 'Poppins', sans-serif;
                  color: inherit;
                  text-decoration: inherit;
                  list-style: none;
                  cursor: default;
              }
              a { opacity: 1; }
              a:hover { cursor: pointer; opacity: 0.7; }
              button:hover { cursor: pointer; }
              .a-reverse { opacity: 0.9; }
              .a-reverse:hover { opacity: 1; cursor: pointer; }
              .reverse-btn {
                  background-color: var(--btn-light);
                  color: #eaeaea;
                  padding: 0.3125rem;
                  border-radius: 0.3125rem;
              }
              .reverse-btn:hover {
                  background-color: var(--btn-light-hover);
                  opacity: 1;
              }
              .btn {
                  background-color: var(--bg-color);
                  color: var(--bleu);
                  padding: 0.3125rem;
                  border-radius: 0.3125rem;
              }
              .btn:hover {
                  background-color: var(--bg-color);
                  opacity: 1;
              }
              .center { display: flex; flex-direction: column; justify-content: center; }
              .inline {
                  display: flex;
                  padding-inline: 0.625rem;
                  align-items: center;
                  box-sizing: border-box;
              }

              /* Header */
              header {
                  position: fixed;
                  z-index: 400;
                  top: 0;
                  width: 100%;
                  height: 4.375rem;
                  display: flex;
                  justify-content: space-between;
                  background-color: var(--bg-color-08);
                  align-items: center;
                  border-color: inherit;
                  color: var(--btn-light);
                  padding: 0.5rem 1rem;
                  box-sizing: border-box;
                  padding-inline: 3%;
              }
              .nav-btn {
                  font-size: 1.5rem;
                  cursor: pointer;
                  opacity: 0.5;
                  background-color: inherit;
                  box-sizing: border-box;
                  border: none;
                  display: none;
              }
              .nav-btn:hover {
                  opacity: 1;
              }
              .logo a img {
                  cursor: pointer;
              }
              header:hover {
                  background-color: var(--bg-color);
              }
              .logo {
                  margin-top: 0.3125rem;
              }
              .logo:hover {
                  opacity: 1;
                  cursor: pointer;
              }
              .login ul, .user-nav ul, .main-nav ul {
                  display: flex;
                  column-gap: 0.9375rem;
                  text-transform: uppercase;
                  font-size: small;
                  align-items: center;
              }
              .main-nav ul li, .login ul li, .user-nav ul li {
                  font-size: 0.9rem;
              }
              .logout-btn {
                  background-color: var(--btn-light);
                  border: none;
                  color: #eaeaea;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 0.625rem;
              }
              .logout-btn:hover {
                  background-color: transparent;
                  cursor: pointer;
                  opacity: 1;
              }
              .logout-btn .spinner {
                  display: none;
              }
              .logout-btn:disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
              }
              .logout-btn span:hover {
                  cursor: pointer;
              }

              /* Dark Mode */
              @media (prefers-color-scheme: dark) {
                  header {
                      background: var(--dark-bg-color-08);
                      color: var(--dark-text-color);
                  }
                  header:hover {
                      background-color: var(--dark-bg-color);
                      transition: 0.5s;
                  }
                  .logout-btn {
                      background-color: transparent;
                  }
                  .logout-btn:hover {
                      background-color: var(--btn-dark-hover);
                  }
              }

              /* Responsive */
              @media (max-width: 1084px) {
                  header {
                      padding-inline: 2%;
                  }
              }

              @media (max-width: 760px) {
                  .main-nav, .user-nav, .login {
                      display: none;
                  }
                  .nav-btn {
                      display: block;
                  }
                  .logo img {
                      width: 6rem;
                  }
                  .conn-log{display: none;}
              }

              @media (max-width: 480px) {
                  header {
                      height: 3.75rem;
                  }
                  .nav-btn {
                      font-size: 1.25rem;
                  }
              }

              .hidden { display: none; }
              .flex { display: flex; }
          </style>
          <header class="header">
              <div class="logo"><a href="./main.html#top" class="a-reverse"><img src="./src/logo.webp" alt="Logo" width="120" loading="lazy"></a></div>
              <nav class="main-nav">
                  <ul>
                      <li class="reverse-btn a-reverse"><a href="./main.html#top" class="a-reverse">Accueil</a></li>
                      <li><a href="./reservation.html">Parc-auto</a></li>
                      <li><a href="main.html#agence">Nos agences</a></li>
                      <li><a href="#contact-form" class="contact-link">Contact</a></li>
                  </ul>
              </nav>
              <div class="conn-log">
              <nav id="login" class="login">
                  <ul>
                      <li><a href="./login.html">connexion</a></li>
                      <li class="reverse-btn a-reverse"><a class="a-reverse" href="./signup.html">inscription</a></li>
                  </ul>
              </nav>
              <nav id="user-nav" class="user-nav">
                  <ul>
                      <li><a id="user" href="./account.html"></a> <i class="fa-solid fa-user"></i></li>
                      <li class="reverse-btn a-reverse">
                          <a id="logout-btn" class="btn a-reverse logout-btn">
                              <span class="btn-text">Deconnect</span>
                              <span class="spinner" style="display: none;">
                                  <i class="fa fa-spinner fa-spin"></i>
                              </span>
                          </a>
                      </li>
                  </ul>
              </nav>
              </div>
              <button type="button" class="nav-btn hidden" id="nav-btn">☰</button>
          </header>
      `;
  }

  connectedCallback() {
      this.shadowRoot.querySelector('.contact-link').addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = e.target.getAttribute('href').substring(1);
          document.dispatchEvent(new CustomEvent('internal-navigate', {
              detail: { targetId }
          }));
      });
  }
}

customElements.define('header-component', HeaderComponent);