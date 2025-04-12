import Account from './Account.js';

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmpassword');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirmpassword-error');
  const submitButton = document.getElementById('sub-btn');

  submitButton.disabled = true;
  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = './main.html';
  }
  emailInput.addEventListener('input', async () => {
    await validateEmail();
    toggleSubmitButton();
  });

  passwordInput.addEventListener('input', () => {
    validatePassword();
    toggleSubmitButton();
  });

  confirmPasswordInput.addEventListener('input', () => {
    validateConfirmPassword();
    toggleSubmitButton();
  });

  const validateForm = async () => {
    const isEmailValid = await validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    return isEmailValid && isPasswordValid && isConfirmValid;
  };

  const validateEmail = async () => {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      emailError.textContent = 'Invalid email format';
      return false;
    }

    try {
      const existingEmails = await loadAccountEmails();
      if (existingEmails.includes(email)) {
        emailError.textContent = 'Email already exists';
        return false;
      }
      emailError.textContent = '';
      return true;
    } catch (error) {
      emailError.textContent = 'Error checking email availability';
      return false;
    }
  };

  const validatePassword = () => {
    const password = passwordInput.value;

    if (password.length < 8) {
      passwordError.textContent = 'At least 8 characters required';
      return false;
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent = 'Include at least one uppercase letter';
      return false;
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = 'Include at least one number';
      return false;
    } else {
      passwordError.textContent = '';
      return true;
    }
  };

  const validateConfirmPassword = () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length === 0) {
      confirmPasswordError.textContent = 'Please confirm your password';
      return false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      return false;
    } else {
      confirmPasswordError.textContent = '';
      return true;
    }
  };

  const toggleSubmitButton = async () => {
    const isValid = await validateForm();
    submitButton.disabled = !isValid;
  };

  const loadAccountEmails = async () => {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) throw new Error('Failed to load account data');
      const accounts = await response.json();
      return accounts.map((account) => account.email);
    } catch (error) {
      console.error('Error loading emails:', error);
      return [];
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) throw new Error('Failed to load account data');
      return await response.json();
    } catch (error) {
      console.error('Error loading accounts:', error);
      return [];
    }
  };

  const saveAccounts = async (accounts) => {
    const blob = new Blob([JSON.stringify(accounts, null, 2)], {
      type: 'application/json'
    });

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'account.json',
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      callAlertBox('Account created successfully!');
      localStorage.setItem('email', emailInput.value.trim());
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', nameInput.value.trim());
      setTimeout(() => { 
        window.location.href = './main.html'; 
      }, 3000);
      await writable.close();
      
    } catch (error) {
      console.error('File picker save failed:', error);
      callAlertBox('Failed to save. Please try again.', 'error');
    }

  };

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
    alertBox.style.backgroundColor = type === 'error' ? '#ffe6e6' : '#e6ffe6';
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  document.getElementById('sub-btn').addEventListener('click', async (event) => {
    event.preventDefault();
  
    if (await validateForm()) {
      let accounts = await loadAccounts();
  
      const newAccount = new Account(
        nameInput.value.trim(),
        passwordInput.value,
        '', // phone
        emailInput.value.trim(),
        '', // photo
        '', // address
        '', // birthDate
        '', // cin
        ''  // permis
      );
  
      accounts.push(newAccount);
      saveAccounts(accounts);
    }
  });
});
