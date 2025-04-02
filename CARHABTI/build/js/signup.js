import Account from './Account.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#signup-form form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmpassword');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirmpassword-error');
  const submitButton = document.getElementById('sub-btn');

  console.log(loadAccountEmails()); 

  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  let isFormValid = false;

  async function validateForm() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const isEmailValid = await validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    isFormValid = isEmailValid && isPasswordValid && isConfirmValid;
    return isFormValid;
  }

  async function validateEmail() {
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
  }

  function validatePassword() {
    const password = passwordInput.value;

    if (password.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters';
      return false;
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent =
        'Password must contain at least one uppercase letter';
      return false;
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = 'Password must contain at least one number';
      return false;
    } else {
      passwordError.textContent = '';
      return true;
    }
  }

  function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      return false;
    } else if (confirmPassword.length === 0) {
      confirmPasswordError.textContent = 'Please confirm your password';
      return false;
    } else {
      confirmPasswordError.textContent = '';
      return true;
    }
  }

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateForm()) {
      const account = new Account(
        nameInput.value.trim(),
        passwordInput.value,
        '', // phone
        emailInput.value.trim(),
        '', // photo
      );

      try {
        await saveAccount(account);
        alert('Account created successfully');
        form.reset();
      } catch (error) {
        alert('Failed to create account. Please try again.');
        console.error('Account creation error:', error);
      }
    }
  });

  async function saveAccount(account) {
    try {
      const response = await fetch('../../save_account.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save');

      console.log('Account saved:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async function loadAccountEmails() {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) {
        throw new Error('Failed to load account data');
      }
      const accounts = await response.json();
      return accounts.map((account) => account.email);
    } catch (error) {
      console.error('Error loading account emails:', error);
      return [];
    }
  }
});
