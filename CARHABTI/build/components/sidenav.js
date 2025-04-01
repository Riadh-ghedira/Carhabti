class SideNavComponent extends HTMLElement {
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
            --side-nav-bg: rgba(21, 114, 211, 0.9);
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
        /*loading*/
        .loading-screen { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: white; 
            color: black; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            font-size: 2rem; 
            z-index: 1000; 
        }
        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid #ddd;
          border-top-color: #3498db; 
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
        /*side nav*/
        .side-nav{
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: 100%;
            background: rgba(21, 114, 211, 0.7);
            color: var(--bg-color);
            z-index: 500;
            animation: slideInRight 0.2s  ease-in forwards;
            transition: 1s;
            padding: 1rem;
            box-sizing: border-box;
            display: none;
            justify-content: center;
            padding-top: 80px;
        }
        .side-nav.fadeout {
            animation: slideOutRight 0.2s ease-out forwards;
        }
        .side-nav:hover{background-color: var(--bleu); transition: 0.3s;}

        .close-btn{
            position: absolute;
            top: 0;
            right: 5px;
            font-size: 1.5rem;
            cursor: pointer;
            color: whitesmoke;
            background-color: transparent;
            box-sizing: border-box;
            opacity: 0.5;
            border: none;
            z-index: 1000;
            margin: 5px;
        }
        .close-btn:hover{
            opacity: 1;
        }
        .navsection {
            font-size: 1.5rem;
            height: 40vh;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            text-transform: uppercase;
            text-align: center;
        }
        .navsection ul li{
            margin-block: 10px;
        }
        /*--------------------------------------------------------------------------------*/
        /*header*/


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
            
            .side-nav {background: var(--dark-header-footer-bg);}
            
            .side-nav{
                background-color: var(--bleu-mid-transparent);

            }
        }
        /*------------------------------------------------------*/
        /*responsive display*/
        @media (max-width: 760px) {
            .navsection {font-size: 1.2rem;}
            
        }

        </style>
        <section id="side-nav" class="side-nav">
          <button type="button" class="close-btn">✖</button>
          <nav class="navsection">
            <ul>
              <li class="btn a-reverse"><a href="./main.html#top" class="a-reverse">Accueil</a></li>
              <li><a href="./reservation.html">Parc-auto</a></li>
              <li><a href="main.htlm#agence">Nos agences</a></li>
              <li><a a href="#contact-form" class="contact-link">Contact</a></li>
            </ul>
            <ul>
              <li><a href="./login.html">connexion</a></li>
              <li class="btn a-reverse"><a class="a-reverse" href="./signup.html">inscription</a></li>
            </ul>
          </nav>
        </section>
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
  
  customElements.define('side-nav-component', SideNavComponent);