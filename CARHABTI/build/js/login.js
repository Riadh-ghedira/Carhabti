import Account from './Account.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const submitButton = form.querySelector('button[type="submit"]');

  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);

  async function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      emailError.textContent = 'Invalid email format';
      return false;
    }

    emailError.textContent = '';
    return true;
  }

  function validatePassword() {
    const password = passwordInput.value;

    if (password.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters';
      return false;
    }

    passwordError.textContent = '';
    return true;
  }

  async function validateForm() {
    const isEmailValid = await validateEmail();
    const isPasswordValid = validatePassword();

    return isEmailValid && isPasswordValid;
  }

  const callAlertBox = (msg, type = '') => {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.innerHTML = `
      <style>
      .alert-box {
        height: auto;
        width: 300px;
        padding: 15px 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: fixed;
        top: 60px;
        right: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.3s ease-in-out;
        column-gap: 15px;
        background-color: ${type === 'error' ? '#ffe6e6' : '#e6ffe6'};
        z-index: 2000;
        font-family: Arial, sans-serif;
      }
      .alert-box .icon {
        font-size: 24px;
      }
      .alert-box .msg {
        font-size: 16px;
        font-weight: 500;
        disolay: flex;
        align-items: center;
        justyfy-content: center;
        color: ${type === 'error' ? '#cc0000' : '#006600'};
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      </style>
      <div class="icon" style="color: ${type === 'error' ? '#cc0000' : '#006600'};">
      <i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
      </div>
      <div class="msg"><p>${msg}</p></div>
    `;
    alertBox.style.backgroundColor = type === 'error' ? '#ff000065' : '#00ff2265';
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateForm()) {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        const isAuthenticated = await authenticateUser(email, password);
        if (isAuthenticated) {
          const name = await getName(email);
          const isAdmin = await checkAdmin(email);

          localStorage.setItem('email', email);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', name);

          if (isAdmin) {
            localStorage.setItem('isAdmin', 'true');
          }

          callAlertBox('Login successful');
          form.reset();

          setTimeout(() => {
            window.location.href = '../CARHABTI/main.html';
          }, 2000);
        } else {
          callAlertBox('Invalid email or password', 'error');
        }
      } catch (error) {
        callAlertBox('Failed to login. Please try again.', 'error');
        console.error('Login error:', error);
      }
    }
  });

  async function checkAdmin(email) {
    try {
      const response = await fetch('./data/admin-list.json');
      if (!response.ok) {
        throw new Error('Failed to load admin list');
      }

      const list = await response.json();
      return Array.isArray(list) && list.some((admin) => admin.email === email);
    } catch (error) {
      console.error('Error checking admin:', error);
      return false;
    }
  }

  async function authenticateUser(email, password) {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) {
        throw new Error('Failed to load account data');
      }

      const accounts = await response.json();
      return accounts.some(
        (account) => account.email === email && account.password === password
      );
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async function getName(email) {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) {
        throw new Error('Failed to load account data');
      }

      const accounts = await response.json();
      const account = accounts.find((account) => account.email === email);
      return account ? account.name : '';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return '';
    }
  }
});
