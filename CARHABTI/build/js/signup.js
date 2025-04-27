document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form-el');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmpassword');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirmpassword-error');
  const submitButton = document.getElementById('sub-btn');

  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = './main.html';
  }
  fetch('/carhabti/CARHABTI/build/php/check_session.php')
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) window.location.href = './main.html';
    });

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  function validateName() {
    const name = nameInput.value.trim();
    if (name.length < 2) {
      nameError.textContent = 'Name must be at least 2 characters';
      return false;
    }
    nameError.textContent = '';
    return true;
  }

  function validateEmail() {
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
      passwordError.textContent = 'At least 8 characters required';
      return false;
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent = 'Include at least one uppercase letter';
      return false;
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = 'Include at least one number';
      return false;
    }
    passwordError.textContent = '';
    return true;
  }

  function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword.length === 0) {
      confirmPasswordError.textContent = 'Please confirm your password';
      return false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      return false;
    }
    confirmPasswordError.textContent = '';
    return true;
  }

  function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    return isNameValid && isEmailValid && isPasswordValid && isConfirmValid;
  }

  const callAlertBox = (msg, type = 'success') => {
    console.log(`Alert: ${msg} (${type})`);
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box', type);
    alertBox.innerHTML = `
      <div class="icon"><i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i></div>
      <div class="msg"><p>${msg}</p></div>
    `;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    if (validateForm()) { 
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      const btnText = submitButton.querySelector('.btn-text');
      const spinner = submitButton.querySelector('.spinner');

      btnText.style.display = 'none';
      spinner.style.display = 'inline-block';
      submitButton.disabled = true;

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmpassword', confirmPassword);
        formData.append('submit', 'true');

        const response = await fetch('/carhabti/CARHABTI/build/php/signup.php', {
          method: 'POST',
          body: formData
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid server response format');
        }

        console.log('Parsed response:', result);

        if (result.status === 'success') {
          callAlertBox('Signup successful');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('email', result.email);
          localStorage.setItem('userName', result.name);
          localStorage.setItem('isAdmin', result.isAdmin ? 'true' : 'false');
          form.reset();
          setTimeout(() => {
            window.location.href = './main.html';
          }, 2000);
        } else {
          callAlertBox(result.message || 'Signup failed', 'error');
        }
      } catch (error) {
        callAlertBox(error.message || 'Failed to signup. Please try again.', 'error');
        console.error('Signup error:', error);
      } finally {
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
        submitButton.disabled = false;
      }
    }
  });
});