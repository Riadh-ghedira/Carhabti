class HeaderComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :root {
    --bg-color: #F7FBFF;
    --bg-color-08: rgb(247, 251, 255,.8);
    --text-color: #3c3744;
    --dark-bg-color: #1b1e26;
    --dark-bg-color-08: rgb(27, 30, 38,.8);
    --dark-text-color: #eaeaea;
    --footer-bg: #051C34;
    --footer-color: #eaeaea;
    --side-nav-bg: rgba(21, 114, 211, 0.3);
    --btn-light: #1572D3;
    --btn-light-hover: rgba(21, 114, 211 , 0.6);
    --btn-dark: #042344cb;
    --btn-dark-hover: #3a7ca5;
    --bleu: #1572D3;
    --bleu-transparent: rgba(21, 114, 211, 0.1);
    --bleu-mid-transparent: rgba(21, 114, 211, 0.5);
    scrollbar-color: var(--bleu) transparent;
    scrollbar-width: thin;
}
/*----------------------------------------*/
* {
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    font-family: Arial, sans-serif;
    color: inherit;
    text-decoration: inherit;
    list-style: none;
    cursor: default;
    font-family: 'poppins', sans-serif;
}
a{opacity: 1;}
a:hover{cursor: pointer;opacity: 0.7;}
button:hover{cursor: pointer;}
.a-reverse{opacity: 0.9;}
.a-reverse:hover{opacity: 1;cursor: pointer;}
.reverse-btn{
    background-color: var(--btn-light);
    color: #eaeaea;
    padding: 5px;
    border-radius: 5px;
}
.reverse-btn:hover{
    background-color: var(--btn-light-hover);
    opacity: 1;
}
.btn{
    background-color: var(--bg-color);
    color: var(--bleu);
    padding: 5px;
    border-radius: 5px;
}
.btn:hover{
    background-color: var(--bg-color);
    opacity: 1;
}
.hidden{display: none;}
.flex{display: flex;}
.center{display: flex; flex-direction: column; justify-content: center;}
.inline{
    display: flex;
    padding-inline: 10px;
    align-items: center;
    box-sizing: border-box;
}
/*--------------------------------------------------------------------------------*/
/*header*/
header{
    position: fixed;
    z-index: 400;
    top: 0;
    width: 100%;
    height: 70px;
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
    .nav-btn{
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.5;
    background-color: inherit;
    box-sizing: border-box;
    border: none;
    display: none;
}
.nav-btn:hover{
    opacity: 1;
}
header:hover{background-color: var(--bg-color);}
.logo {margin-top: 5px;}
.logo:hover{opacity: 1;cursor: pointer;}
.login ul,.main-nav ul{
    display: flex;
    column-gap: 15px;
    text-transform: uppercase;
    font-size: small;
    align-items: center;
}
.main-nav ul li, .login ul li {
    font-size: 0.9rem;
}

/*animation*/
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes slideIn { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes slideOut { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes slideInBottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideOutBottom { from { transform: translateY(0); } to { transform: translateY(100%); } }
@keyframes slideInTop { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/*--------------------------------------------------------------------------------*/
/*dark mode*/
@media (prefers-color-scheme: dark) {
    .header {
        background: var(--dark-bg-color-08);
        color: var(--dark-text-color);
    }
    .header:hover{
        background-color: var(--dark-bg-color);
        transition: 0.5s;
    }
}
/*------------------------------------------------------*/
/*responsive display*/
@media (max-width: 760px) {
    .main-nav,.login{display: none;}
    .nav-btn{display: block;}
}

@media (max-width: 1084px) {
    .header {
        padding-inline: 2%;
        width: 100%
        
    }    
}
        </style>
        <header class="header">
          <div class="logo"><a href="./main.html#top" class="a-reverse"><img src="./src/logo.webp" alt="Logo" width="120" loading="lazy"></a></div>
          <nav class="main-nav">
            <ul>
              <li class="reverse-btn a-reverse"><a href="./main.html#top" class="a-reverse">Accueil</a></li>
              <li><a href="./reservation.html">Parc-auto</a></li>
              <li><a href="#agence">Nos agences</a></li>
              <li ><a a href="#contact-form" class="contact-link" >Contact</a></li>
            </ul>
          </nav>
          <nav class="login">
            <ul>
              <li><a href="./login.html">connexion</a></li>
              <li class="reverse-btn a-reverse"><a class="a-reverse" href="./signin.html">inscription</a></li>
            </ul>
          </nav>
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