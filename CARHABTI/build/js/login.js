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

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateForm()) {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        const isAuthenticated = await authenticateUser(email, password);
        const name = await getName(email);
        if (isAuthenticated) {
          alert('Login successful');
          form.reset();
          const isAdmin = await Admin(email);
          if (isAdmin) localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', name);
          window.location.href = '../CARHABTI/main.html';
        } else {
          alert('Invalid email or password');
        }
      } catch (error) {
        alert('Failed to login. Please try again.');
        console.error('Login error:', error);
      }
    }
  });
  async function Admin(email) {
    try {
      const response = await fetch('./data/admin-list.json');
      if (!response.ok) {
        throw new Error('Failed to load admin list');
      }
      const list = await response.json();
      if (!Array.isArray(list)) {
        console.error('Admin list is not in the expected format');
        return false;
      }
      return list.some((admin) => admin.email === email);
    } catch (error) {
      console.error('Error finding admin:', error);
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
        (account) => account.email === email && account.password === password,
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
