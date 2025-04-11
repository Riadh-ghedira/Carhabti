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

  let isFormValid = false;

  const validateForm = async () => {
    const isEmailValid = await validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    isFormValid = isEmailValid && isPasswordValid && isConfirmValid;
    return isFormValid;
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
    const isFormValid = await validateForm();
    submitButton.disabled = !isFormValid;
  };

  submitButton.disabled = true;

  const loadAccountEmails = async () => {
    try {
      const response = await fetch('../../data/account.json');
      if (!response.ok) {
        throw new Error('Failed to load account data');
      }
      const accounts = await response.json();
      return accounts.map((account) => account.email);
    } catch (error) {
      console.error('Error loading account emails:', error);
      return [];
    }
  };

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateForm()) {
      const account = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        phone: '',
        photo: '',
      };
      
    }
  });
});
