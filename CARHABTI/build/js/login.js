document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form-el');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const submitButton = form.querySelector('button[type="submit"]');

  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);

  localStorage.getItem('isLoggedIn') === 'true' ? window.location.href = '../CARHABTI/main.html' : null;
  fetch('/carhabti/CARHABTI/build/php/check_session.php')
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) window.location.href = './main.html';
    });

    const callAlertBox = (msg, type = 'success') => {
      console.log(`Alert: ${msg} (type: ${type})`);
      const alertBox = document.createElement('div');
      alertBox.classList.add('alert-box', type);
      alertBox.innerHTML = `
        <div class="icon"><i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i></div>
        <div class="msg"><p>${msg}</p></div>
      `;
      document.body.appendChild(alertBox);
      setTimeout(() => alertBox.remove(), 3000);
    };
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
      passwordError.textContent = 'Password must be at least 8 characters';
      return false;
    }

    passwordError.textContent = '';
    return true;
  }

  function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    return isEmailValid && isPasswordValid;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (validateForm()) {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      const btnText = submitButton.querySelector('.btn-text');
      const spinner = submitButton.querySelector('.spinner');

      btnText.style.display = 'none';
      spinner.style.display = 'inline-block';
      submitButton.disabled = true;

      try {
        const result = await authenticateUser(email, password);
        
        if (result.success) {
          callAlertBox('Login successful');
          form.reset();

          setTimeout(() => {
            window.location.href = '../CARHABTI/main.html';
          }, 2000);
        } else {
          callAlertBox(result.message || 'Authentication failed', 'error');
        }
      } catch (error) {
        callAlertBox('Failed to login. Please try again.', 'error');
        console.error('Login error:', error);
      } finally {
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
        submitButton.disabled = false;
      }
    }
  });

  async function authenticateUser(email, password) {
    try {
      console.log('Creating form data');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const response = await fetch('/carhabti/CARHABTI/build/php/login.php', {
        method: 'POST',
        body: formData
      });

      
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        return { 
          success: false, 
          message: `Server error: ${response.status} ${response.statusText}` 
        };
      }
      
      try {
        const responseText = await response.text();
        
        if (!responseText.trim()) {
          return { 
            success: false, 
            message: 'Server returned empty response' 
          };
        }
        
        const result = JSON.parse(responseText);
        
        if (result.status === 'success') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('email', result.email);
          localStorage.setItem('userName', result.name);
          localStorage.setItem('isAdmin', result.isAdmin ? 'true' : 'false');
          return { success: true };
        } else {
          return { 
            success: false, 
            message: result.message || 'Authentication failed' 
          };
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return { 
          success: false, 
          message: 'Failed to parse server response' 
        };
      }
    } catch (error) {
      console.error('Network error:', error);
      return { 
        success: false, 
        message: 'Network error: ' + error.message 
      };
    }
  }
});