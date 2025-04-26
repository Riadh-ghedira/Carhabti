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

  const callAlertBox = (msg, type = '') => {
    console.log(`Alert: ${msg} (${type})`); // Log alerts to console as well
    
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
        display: flex;
        align-items: center;
        justify-content: center;
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
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    if (validateForm()) {
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      console.log(`Attempting login with email: ${email}`);

      const btnText = submitButton.querySelector('.btn-text');
      const spinner = submitButton.querySelector('.spinner');

      btnText.style.display = 'none';
      spinner.style.display = 'inline-block';
      submitButton.disabled = true;

      try {
        const result = await authenticateUser(email, password);
        console.log('Authentication result:', result);
        
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
      
      console.log('Sending request to server');
      const response = await fetch('/carhabti/CARHABTI/build/php/login.php', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        return { 
          success: false, 
          message: `Server error: ${response.status} ${response.statusText}` 
        };
      }
      
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!responseText.trim()) {
          return { 
            success: false, 
            message: 'Server returned empty response' 
          };
        }
        
        const result = JSON.parse(responseText);
        console.log('Parsed response:', result);
        
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