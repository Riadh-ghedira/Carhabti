
class FooterComponent extends HTMLElement {
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
                .hidden { display: none; }
                .flex { display: flex; }
                .center { display: flex; flex-direction: column; justify-content: center; }
                .inline {
                    display: flex;
                    padding-inline: 0.625rem;
                    align-items: center;
                    box-sizing: border-box;
                }

                /* Footer */
                footer {
                    width: 100%;
                    box-sizing: border-box;
                    background: var(--footer-bg) url('./src/bg.webp') no-repeat center center;
                    background-size: cover;
                    position: relative;
                    color: var(--footer-color);
                    font-size: clamp(14px, 2.5vw, 16px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    bottom: 0;
                    left: 0;
                    padding-block: 0.625rem;
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
                    opacity: 0.9;
                }
                footer * {
                    position: relative;
                    z-index: 101;
                    padding-bottom: 0.625rem;
                }
                .footer {
                    width: 100%;
                    display: flex;
                    margin-top: 1.25rem;
                    justify-content: space-evenly;
                    font-size: clamp(15px, 2.8vw, 18px);
                    font-weight: 500;
                    column-gap: 0.625rem;
                    flex-wrap: wrap;
                    row-gap: 0.3125rem;
                }
                .footer section h2 {
                    text-align: start;
                    margin-bottom: 0.625rem;
                }
                .footer section {
                    min-width: 21.875rem;
                    margin-block: 1.25rem;
                }
                .agence ul li {
                    list-style-type: circle;
                    font-size: 1rem;
                    font-weight: 300;
                    text-decoration: underline;
                    text-wrap: wrap;
                }
                .social-nav {
                    font-size: 2rem;
                    column-gap: 0.9375rem;
                    align-content: center;
                    align-self: center;
                }
                .social-nav hr {
                    height: 1.875rem;
                    opacity: 1;
                }
                .contact-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 1.875rem;
                    width: clamp(15rem, 80vw, 18.75rem);
                    margin-inline-end: 1.25rem;
                }
                .contact-form h2 {
                    text-align: center;
                    margin-bottom: 0.625rem;
                    font-size: 1.5rem;
                }
                .contact-form label {
                    display: block;
                    font-weight: bold;
                    font-size: 1rem;
                    text-align: start;
                    margin-bottom: 0.125rem;
                }
                .contact-form input,
                .contact-form textarea {
                    width: 100%;
                    padding: 0.5rem;
                    margin-bottom: 0.625rem;
                    border: 1px solid #ccc;
                    border-radius: 0.3125rem;
                    font-size: 0.9rem;
                }
                .contact-form button {
                    display: block;
                    width: 110%;
                    padding: 0.625rem;
                    background-color: var(--btn-light);
                    color: white;
                    border: none;
                    border-radius: 0.3125rem;
                    font-size: 1rem;
                    cursor: pointer;
                    font-weight: 600;
                }
                .contact-form button:hover {
                    background-color: var(--btn-light-hover);
                }
                footer hr {
                    margin: 0;
                    padding: 0;
                    border: solid 0.1px var(--footer-color);
                    opacity: 0.3;
                }
                .Copyright {
                    opacity: 0.3;
                }

                /* Dark Mode */
                @media (prefers-color-scheme: dark) {
                    .contact-form input, .contact-form textarea {
                        background-color: var(--dark-bg-color);
                        border: 1px solid var(--dark-text-color);
                        color: var(--dark-text-color);
                    }
                    .contact-form button {
                        background-color: var(--btn-dark);
                    }
                    .contact-form button:hover {
                        background-color: var(--btn-dark-hover);
                    }
                }

                /* Responsive */
                @media (max-width: 1084px) {
                    .footer {
                        padding-inline: 2%;
                    }
                    .contact-form {
                        max-width: 18.75rem;
                        align-self: center;
                    }
                    .contact-form input,
                    .contact-form textarea {
                        max-width: 18.75rem;
                        font-size: 0.95rem;
                    }
                    footer {
                        font-size: clamp(13px, 2.2vw, 15px);
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

                @media (max-width: 760px) {
                    footer {
                        background: var(--footer-bg) url('./src/bg-small.webp') no-repeat center center;
                        background-size: cover;
                        position: relative;
                    }
                    .footer {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        font-size: clamp(12px, 2vw, 14px);
                    }
                    .footer section h2 {
                        text-align: center;
                    }
                    .footer section {
                        margin-block: 0.625rem;
                    }
                    .contact-form {
                        max-width: 18.75rem;
                        align-self: center;
                    }
                    .contact {
                        flex-direction: column;
                        align-items: center;
                    }
                    .contact-form input,
                    .contact-form textarea {
                        max-width: 18.75rem;
                        font-size: 0.9rem;
                    }
                    .contact-form h2 {
                        font-size: 1.5rem;
                    }
                    .contact-form label {
                        font-size: 0.9rem;
                    }
                    .contact-form button {
                        font-size: 0.9rem;
                    }
                    .social-nav {
                        justify-self: center;
                    }
                    .small {
                        font-size: 0.8rem;
                        display: none;
                    }
                    .div {
                        min-width: 26.875rem;
                        padding-right: 2.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .footer section {
                        min-width: 15rem;
                    }
                    .contact-form {
                        width: clamp(12.5rem, 90vw, 15rem);
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
                        <div class="social-nav flex"><a href="#"><img src="./src/icons8-facebook-50.png" width="30"></a> <hr> <a href="#"><img src="./src/icons8-instagram-logo-64.png" width="30"></a> <hr> <a href="#"><img src="./src/icons8-youtube-50.png" width="30"></a></div>
                    </section>
                    <section id="contact-form" class="contact-form">
                        <h2>Contact Us</h2>
                        <form action="https://httpbin.org/post" method="get">
                            <label for="name">Name:</label>
                            <input type="text" id="contact-name" name="name" autocomplete="name" required placeholder="Jhon Doe" />
                            <label for="email">Email:</label>
                            <input type="email" id="contact-email" name="email" autocomplete="email" required placeholder="example@example.com"/>
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