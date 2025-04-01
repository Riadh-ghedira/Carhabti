class FooterComponent extends HTMLElement {
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

/*------------------------------------------------------------------------*/

/*partie footer*/
footer {
    width: 100%;
    box-sizing: border-box;
    background: var(--footer-bg) url('../src/bg.webp') no-repeat center center;
    background-size: cover;
    position: relative;
    color: var(--footer-color);
    font-size: 16px; 
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    bottom: 0;
    left: 0;
    padding-block: 10px;
    padding-inline: 3%;
    margin-top: auto;
    z-index: 100;
}
footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--footer-bg);
    opacity: 0.9 /* Adjust the opacity as needed */
}
footer * {
    position: relative;
    z-index: 101;
    padding-bottom: 10px;
}
.footer{
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: space-evenly;
    font-size: 18px; 
    font-weight: 500;
    column-gap: 10px;
    flex-wrap: wrap;
    row-gap: 5px;
}
.footer section h2{
    text-align: start;
    margin-bottom: 10px;
}
.footer section{
    min-width: 350px;
    margin-block: 20px;

}
.agence ul li {
    list-style-type: circle;
    font-size: 1rem;
    font-weight: 300;
    text-decoration: underline;
    text-wrap: wrap;
}
.social-nav{font-size: 2rem; column-gap: 15px; align-content: center; align-self: center;}
.social-nav hr{height: 30px; opacity: 1; }
.contact-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    width: 300px;
    margin-inline-end: 20px;
    
}
.contact-form h2 {
    text-align: center;
    margin-bottom: 10px;
    font-size: 1.5rem;
}
.contact-form label {
    display: block;
    font-weight: bold;
    font-size: 1rem;
    text-align: start;
    margin-bottom: 2px;
}
.contact-form input,
.contact-form textarea {
    width: 300px;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.9rem;
}
.contact-form button {
    display: block;
    width: 316px;
    padding: 10px;
    background-color: var(--btn-light);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;

}
.contact-form button:hover {
    background-color: var(--btn-light-hover);
}        
footer hr{
    margin: 0;
    padding: 0;
    border: solid 0.1px var(--footer-color);
    opacity: 0.3;
}
.Copyright{
    opacity: 0.3;
}
/*---------------------------------------------------------------------------*/


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
    .contact-form input , .contact-form textarea {
        background-color: var(--dark-bg-color);
        border:none;
        color: whitesmoke;
    }
    .contact-form button {
        background-color: var(--btn-dark);
    }

}
/*------------------------------------------------------*/
/*responsive display*/
@media (max-width: 760px) {
    footer{
        background: var(--footer-bg)url('../src/bg-small.webp') no-repeat center center;
        background-size: cover;
        position: relative;
    }
    .footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        font-size: 1rem;
        font-weight: 500;
    }
    .footer section h2{text-align: center;}
    .footer section{margin-block: 10px;}
    .contact-form {
        max-width: 300px;
        align-self: center;
    }
    .contact{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .contact-form input,
    .contact-form textarea{
        max-width: 300px;
        font-size: 0.9rem;
    }
    .contact-form h2 {font-size: 1.5rem;}
    .contact-form label {font-size: 0.9rem;}
    .contact-form button {font-size: 0.9rem;}
    .social-nav{justify-self: center;}
    .small{
        font-size: 0.8rem;
        display: none;
    }
    
    .div{
        min-width: 430px;
        padding-right: 40px;
    }
    
}

@media (max-width: 1084px) {
    .footer {
        padding-inline: 2%;
        width: 100%
        
    }
    .contact-form {
        max-width: 300px;
        align-self: center;
    }
    .contact-form input,
    .contact-form textarea{
        max-width: 300px;
        font-size: 0.95rem;
    }

    footer {
        font-size: 15px;
    }
    .contact-form h2 {
        font-size: 1.6rem;
    }
    .contact-form label {
        font-size: 0.95rem;
    }
    .contact-form button {
        font-size: 0.95rem;
    }
}
        </style>
        <footer>
          <section class="footer">
            <section class="contact">
              <div class="name inline"><img src="./src/logo-white.webp" alt="CARHABTI" width="200" loading="lazy"></div>
              <h5 class="inline"><big>📞</big><a href="tel:+216 22 222 222"> + 216  22 222 222</a></h5>
              <h5 class="inline"><big>📧</big><a href="mailto:booking@carhabti.tn"> booking@carhabti.tn</a> </h5>
            </section>
            <section class="agence">
              <h2>Nos agences</h2>
              <ul class="agence-list">
                <li><a href="">CARHABTI Tunis</a></li>
                <li><a href="">CARHABTI Airport TUNIS CARTHAGE</a></li>
                <li><a href="">CARHABTI Nabeul</a></li>
                <li><a href="">CARHABTI Grombalia</a></li>
                <li><a href="">CARHABTI Airport NFIDHA</a></li>
                <li><a href="">CARHABTI Sousse</a></li>
                <li><a href="">CARHABTI Monastir</a></li>
                <li><a href="">CARHABTI Airport HABIB BOURGUIBA MONASTIR</a></li>
                <li><a href="">CARHABTI Houmet Souk</a></li>
                <li><a href="">CARHABTI Airport DJERBA JIRJIS</a></li>
              </ul>
            </section>
            <section class="follow-us">
              <h2>Follow Us</h2>
              <script src="https://kit.fontawesome.com/ed1023ad28.js" crossorigin="anonymous"></script>
              <div class="social-nav flex"><a href="#"><i class="fa-brands fa-square-facebook"></i></a> <hr> <a href="#"><i class="fa-brands fa-instagram"></i></a> <hr> <a href="#"><i class="fa-brands fa-youtube"></i></a></div>
            </section>
            <section id="contact-form" class="contact-form">
              <h2>Contact Us</h2>
              <form action="https://httpbin.org/post" method="get">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required placeholder="Jhon Doe" />
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required placeholder="example@example.com"/>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="5" required placeholder="Write your Message."></textarea>
                <button type="submit">Submit</button>
              </form>
            </section>
          </section>
          <hr>
          <p><small class="Copyright">Copyright 2025 • Carhabti, All Rights Reserved</small></p>
        </footer>
      `;
    }
    connectedCallback() {
        // Listen for navigation events
        document.addEventListener('internal-navigate', (e) => {
          const targetId = e.detail.targetId;
          const target = this.shadowRoot.getElementById(targetId);
          
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
  }
  
  customElements.define('footer-component', FooterComponent);