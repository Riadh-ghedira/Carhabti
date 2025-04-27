document.addEventListener('DOMContentLoaded', () => {
    const callAlertBox = (msg, type = 'success') => {
      const alertBox = document.createElement('div');
      alertBox.classList.add('alert-box', type);
      alertBox.innerHTML = `
        <div class="icon"><i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i></div>
        <div class="msg"><p>${msg}</p></div>
      `;
      document.body.appendChild(alertBox);
      setTimeout(() => alertBox.remove(), 3000);
    };
  
    const basePath = '/carhabti/CARHABTI';
  
    const initLogout = () => {
      const header = document.querySelector('header-component');
      const sideNav = document.querySelector('side-nav-component');
  
      if (!header || !sideNav) {
        return;
      }
  
      const headerRoot = header.shadowRoot || header.attachShadow({ mode: 'open' });
      const sideNavRoot = sideNav.shadowRoot || sideNav.attachShadow({ mode: 'open' });
  
      const logoutBtn = headerRoot.getElementById('logout-btn');
      const sidelogoutBtn = sideNavRoot.getElementById('side-logout-btn');
  
      if (!logoutBtn && !sidelogoutBtn) {
        console.warn('No logout buttons found');
        return;
      }
  
      const logout = async (buttonEl) => {
  
        const btnText = buttonEl.querySelector('.btn-text');
        const spinner = buttonEl.querySelector('.spinner');
  
        if (btnText && spinner) {
          btnText.style.display = 'none';
          spinner.style.display = 'inline-block';
        } else {
          console.warn('Button missing btn-text or spinner:', { btnText, spinner });
        }
        buttonEl.disabled = true;
  
        try {
          const response = await fetch(`${basePath}/build/php/logout.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
  
          if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
  
          const responseText = await response.text();
  
          let result;
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            throw new Error('Invalid server response format');
          }
  
  
          if (result.status === 'success') {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('email');
            localStorage.removeItem('userName');
            localStorage.removeItem('isAdmin');
            callAlertBox('Logged out successfully', 'success');
            setTimeout(() => {
              window.location.href = './main.html';
            }, 2000);
          } else {
            callAlertBox(result.message || 'Logout failed', 'error');
          }
        } catch (error) {
          callAlertBox(error.message || 'Failed to logout. Please try again.', 'error');
        } finally {
          if (btnText && spinner) {
            btnText.style.display = 'inline-block';
            spinner.style.display = 'none';
          }
          buttonEl.disabled = false;
        }
      };
  
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => logout(logoutBtn)); 
      }
      if (sidelogoutBtn) {
        sidelogoutBtn.addEventListener('click', () => logout(sidelogoutBtn));
      }
    };
  
    const maxAttempts = 5;
    let attempts = 0;
    const tryInitLogout = () => {
      const header = document.querySelector('header-component');
      const sideNav = document.querySelector('side-nav-component');
      if (header && sideNav) {
        initLogout();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryInitLogout, 100);
      } else {
        console.warn('Failed to initialize logout after multiple attempts');
      }
    };
  
    tryInitLogout();
  });