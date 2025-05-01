document.addEventListener("DOMContentLoaded", function () {
  const editName = document.getElementById("edit-name");
  const editPassword = document.getElementById("edit-password");
  const editTel = document.getElementById("edit-tel");
  const editAdresse = document.getElementById("edit-adresse");
  const editBirth = document.getElementById("edit-birth");
  const editCin = document.getElementById("edit-cin");
  const editPermis = document.getElementById("edit-permis");
  const editImg = document.getElementById("edit-img");
  const save = document.getElementById("save");

  const email = document.getElementById("email-input");
  const name = document.getElementById("name-input");
  const password = document.getElementById("password-input");
  const tel = document.getElementById("tel-input");
  const adresse = document.getElementById("adresse-input");
  const birth = document.getElementById("birth-input");
  const cin = document.getElementById("cin-input");
  const permis = document.getElementById("permis-input");
  const img = document.getElementById("img");

  const inputs = document.querySelectorAll('.input-group input');
  let accounts = [];
  let allowChange = false;
  let userData = null;
  let currentPasswordValue = null;

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

  const confirmPasswordChange = () => {
      const confirmBox = document.createElement('div');
      confirmBox.className = 'confirm-box';

      confirmBox.innerHTML = `
          <div class="confirm-content">
              <label for="current-password">Enter current password:</label>
              <input type="password" id="current-password" placeholder="Current Password" required>
              <p>Are you sure you want to change the password?</p>
              <div style="margin-top: 10px;">
                  <button id="confirm-yes">Yes</button>
                  <button id="confirm-no">Cancel</button>
              </div>
          </div>
      `;

      addConfirmBoxStyles();
      document.body.appendChild(confirmBox);

      const yesBtn = confirmBox.querySelector('#confirm-yes');
      const noBtn = confirmBox.querySelector('#confirm-no');
      const currentPasswordInput = document.getElementById("current-password");

      yesBtn.addEventListener('click', () => {
          const enteredPassword = currentPasswordInput.value;
          
          if (enteredPassword) {
              currentPasswordValue = enteredPassword;
              allowChange = true;
              password.disabled = false;
              password.value = '';
              password.focus();
              confirmBox.remove();
          } else {
              currentPasswordInput.style.borderColor = 'red';
              currentPasswordInput.placeholder = 'Password required!';
          }
      });

      noBtn.addEventListener('click', () => {
          allowChange = false;
          password.disabled = true;
          confirmBox.remove();
      });
  };

  const changePhoto = () => {
      const confirmBox = document.createElement('div');
      confirmBox.className = 'confirm-box';

      confirmBox.innerHTML = `
          <div class="confirm-content">
              <p>Are you sure you want to change your profile photo?</p>
              <div style="margin-top: 10px;">
                  <button id="confirm-yes">Yes</button>
                  <button id="confirm-no">Cancel</button>
              </div>
          </div>
      `;

      document.body.appendChild(confirmBox);

      const yesBtn = confirmBox.querySelector('#confirm-yes');
      const noBtn = confirmBox.querySelector('#confirm-no');

      yesBtn.addEventListener('click', () => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';

          fileInput.addEventListener('change', () => {
              const file = fileInput.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                  img.src = reader.result;
                  callAlertBox('Photo updated! Remember to save.', 'success');
              };
              reader.readAsDataURL(file);
          });

          fileInput.click();
          confirmBox.remove();
      });

      noBtn.addEventListener('click', () => {
          confirmBox.remove();
      });
  };

  const fetchUserData = async () => {
      try {
          console.log('Fetching user data...');
          
          const userEmail = localStorage.getItem('email');
          
          if (!userEmail) {
              throw new Error('No email found in localStorage');
          }
          
          const headers = new Headers();
          headers.append('X-Email', userEmail);
          
          const response = await fetch(`./build/php/account.php?email=${encodeURIComponent(userEmail)}`, {
              method: 'GET',
              headers: headers
          });
          
          if (!response.ok) {
              throw new Error(`Server responded with status: ${response.status}`);
          }
          
          userData = await response.json();
          console.log('User data received:', userData);
          
          if (userData && !userData.status) {
              name.value = userData.name || '';
              email.value = userData.email || userEmail || '';
              password.value = '********';
              tel.value = userData.phone || '';
              adresse.value = userData.address || '';
              birth.value = userData.birth || '';
              cin.value = userData.cin || '';
              permis.value = userData.licence || '';
              
              if (userData.photo) {
                  img.src = `data:image/jpeg;base64,${userData.photo}`;
              } else {
                  img.src = './src/bg.webp';
              }
              
              accounts = [userData];
              
              inputs.forEach(input => {
                  const event = new Event('input');
                  input.dispatchEvent(event);
              });
          } else {
              callAlertBox(userData?.message || 'Failed to load user data', 'error');
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
          callAlertBox('Error loading user data: ' + error.message, 'error');
      }
  };

  const saveUserData = async (field, value) => {
      try {
          console.log(`Saving ${field} with value:`, field === 'photo' ? '[PHOTO DATA]' : value);
          
          const formData = new FormData();
          formData.append('field', field);
          formData.append('value', value);
          
          if (field === 'password' && currentPasswordValue) {
              formData.append('current_password', currentPasswordValue);
          }
          
          const userEmail = localStorage.getItem('email');
          if (userEmail) {
              formData.append('email', userEmail);
          }
          
          const response = await fetch('./build/php/account.php', {
              method: 'POST',
              body: formData,
              headers: {
                  'X-Email': userEmail || ''
              }
          });
          
          if (!response.ok) {
              throw new Error(`Server responded with status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('Update result:', result);
          
          if (result.status === 'success') {
              callAlertBox(`${field} updated successfully`, 'success');
              return true;
          } else {
              callAlertBox(result.message || 'Update failed', 'error');
              return false;
          }
      } catch (error) {
          console.error('Error saving user data:', error);
          callAlertBox('Error saving data: ' + error.message, 'error');
          return false;
      }
  };

  save.addEventListener('click', async () => {
      const loggedEmail = localStorage.getItem('email');
      if (!loggedEmail) {
          return callAlertBox('User not logged in', 'error');
      }
      
      save.disabled = true;
      save.textContent = 'Saving...';
      
      try {
          let success = true;
          
          if (userData) {
              if (name.value !== userData.name && name.value.trim()) {
                  success = success && await saveUserData('name', name.value.trim());
              }
              
              if (password.value && password.value !== '********' && password.value.trim()) {
                  success = success && await saveUserData('password', password.value.trim());
                  currentPasswordValue = null;
              }
              
              if (tel.value !== userData.phone && tel.value.trim()) {
                  success = success && await saveUserData('phone', tel.value.trim());
              }
              
              if (adresse.value !== userData.address && adresse.value.trim()) {
                  success = success && await saveUserData('address', adresse.value.trim());
              }
              
              if (birth.value !== userData.birth && birth.value.trim()) {
                  success = success && await saveUserData('birthDate', birth.value.trim());
              }
              
              if (cin.value !== userData.cin && cin.value.trim()) {
                  success = success && await saveUserData('cin', cin.value.trim());
              }
              
              if (permis.value !== userData.licence && permis.value.trim()) {
                  success = success && await saveUserData('licence', permis.value.trim());
              }
              
              if (img.src.includes('data:image') && (!userData.photo || !img.src.includes(userData.photo))) {
                  const imageData = img.src.split(',')[1]; 
                  success = success && await saveUserData('photo', imageData);
              }
          } else {
              callAlertBox('User data not loaded properly', 'error');
              success = false;
          }
          
          if (success) {
              callAlertBox('All changes saved successfully', 'success');
              await fetchUserData();
          } else {
              callAlertBox('Some changes could not be saved', 'error');
          }
      } catch (error) {
          console.error('Error saving changes:', error);
          callAlertBox('Error saving changes: ' + error.message, 'error');
      } finally {
          save.disabled = false;
          save.textContent = 'Confirmer les modifications';
      }
  });

  if (localStorage.getItem('email')) {
      email.value = localStorage.getItem('email');
      fetchUserData();
  } else {
      callAlertBox('No user logged in', 'error');
      setTimeout(() => {
          window.location.href = './login.html';
      }, 2000);
  }

  inputs.forEach(input => {
      const mirror = document.createElement('span');
      mirror.className = 'input-mirror';
      mirror.style.position = 'absolute';
      mirror.style.left = '-9999px';
      mirror.style.top = '-9999px';
      mirror.style.whiteSpace = 'pre';
      mirror.style.font = getComputedStyle(input).font;
      document.body.appendChild(mirror);

      const resizeInput = (n = 27) => {
          mirror.textContent = input.value || input.placeholder || '';
          input.style.width = `${mirror.offsetWidth + n}px`;
      };

      resizeInput();
      input.addEventListener('input', resizeInput);
      input.addEventListener('focus', resizeInput);
  });

  const logoutAcc = document.getElementById('logout');
  logoutAcc.addEventListener('click', () => {
      localStorage.removeItem('email');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('isAdmin', 'false');
      callAlertBox('Logged out successfully', 'success');
      setTimeout(() => {
          window.location.href = './main.html';
      }, 1000);
  });

  const enableEditing = (input) => {
      inputs.forEach(i => i.disabled = true);
      input.disabled = false;
      input.focus();
  };

  editName.addEventListener('click', () => enableEditing(name));
  editPassword.addEventListener('click', () => allowChange ? enableEditing(password) : confirmPasswordChange());
  editTel.addEventListener('click', () => enableEditing(tel));
  editAdresse.addEventListener('click', () => enableEditing(adresse));
  editBirth.addEventListener('click', () => enableEditing(birth));
  editCin.addEventListener('click', () => enableEditing(cin));
  editPermis.addEventListener('click', () => enableEditing(permis));
  editImg.addEventListener('click', () => changePhoto());

  const displays = document.querySelectorAll('.display');
  const nav = document.querySelectorAll('.nav-item');
  const show = (id) => {
      nav.forEach(n => n.classList.toggle('clicked', n.id === id));
      displays.forEach(d => {
          if (d.id === `${id}-display`) {
              d.classList.remove('hidden');
              d.style.display = 'block';
          } else {
              d.classList.add('hidden');
              d.style.display = 'none';
          }
      });
  };
  nav.forEach(n => {
      if (n.id !== 'logout') {
          n.addEventListener('click', () => show(n.id));
      }
  });
  show('account');
});