class LoadingComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
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
            transition: opacity 0.5s ease;
          }
          .hidden {
            opacity: 0;
            pointer-events: none;
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #ddd;
            border-top-color: #3498db; 
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="loading-screen">
          <div class="loader"></div>
          <h3 class="loading">loading...</h3>
        </div>
      `;
    }
  
    hide() {
      this.shadowRoot.querySelector('.loading-screen').classList.add('hidden');
      setTimeout(() => {
        this.remove();
      }, 500);
    }
  }
  
  customElements.define('loading-component', LoadingComponent);