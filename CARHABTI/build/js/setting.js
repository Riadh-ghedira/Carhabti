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

  // Confirm password before editing
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
    const currentPasswordInput = document.getElementById('current-password');

    yesBtn.addEventListener('click', () => {
      const enteredPassword = currentPasswordInput.value;
      const actualPassword = password.value;

      if (enteredPassword === actualPassword) {
        allowChange = true;
        password.disabled = false;
        password.focus();
        confirmBox.remove();
      } else {
        currentPasswordInput.style.borderColor = 'red';
        currentPasswordInput.placeholder = 'Incorrect password!';
      }
    });

    noBtn.addEventListener('click', () => {
      allowChange = false;
      password.disabled = true;
      confirmBox.remove();
    });
  };

  // Confirm before choosing photo
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

    addConfirmBoxStyles();
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

  // Styles shared by confirm boxes
  function addConfirmBoxStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .confirm-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--bg-color, #fff);
        color: var(--text-color, #000);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }
      .confirm-content input {
        width: 100%;
        margin: 10px 0;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
      .confirm-content button {
        margin-right: 10px;
        padding: 8px 12px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
      }
      .confirm-content button#confirm-yes {
        background-color: #007bff;
        color: white;
      }
      .confirm-content button#confirm-no {
        background-color: #dc3545;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  // Show notification
  const callAlertBox = (msg, type = '') => {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.innerHTML = `
      <style>
        .alert-box {
          width: 300px;
          padding: 15px 20px;
          position: fixed;
          top: 60px;
          right: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          animation: fadeIn 0.3s ease-in-out;
          display: flex;
          align-items: center;
          column-gap: 15px;
          background-color: ${type === 'error' ? '#ffe6e6' : '#e6ffe6'};
          z-index: 2000;
        }
        .alert-box .msg {
          font-size: 16px;
          font-weight: 500;
          color: ${type === 'error' ? '#cc0000' : '#006600'};
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div class="icon" style="color: ${type === 'error' ? '#cc0000' : '#006600'};">
      <i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
      </div>
      <div class="msg">${msg}</div>
    `;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  const saveUserData = async (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'account.json',
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        }],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      callAlertBox('Changes saved successfully!');
    } catch (error) {
      console.error('File save error:', error);
      callAlertBox('File save cancelled or failed', 'error');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('./data/account.json');
      if (!response.ok) throw new Error('Failed to load account data');

      accounts = await response.json();
      const loggedEmail = localStorage.getItem('email');
      const user = accounts.find(account => account.email === loggedEmail);

      if (user) {
        name.value = user.name;
        password.value = user.password;
        tel.value = user.phone;
        adresse.value = user.address;
        birth.value = user.birthDate;
        cin.value = user.cin;
        permis.value = user.permis;
        img.src = user.photo || './src/bg.webp';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Save changes
  save.addEventListener('click', async () => {
    const loggedEmail = localStorage.getItem('email');
    const user = accounts.find(account => account.email === loggedEmail);
    if (!user) return callAlertBox('User not found', 'error');

    const updatedAccount = {
      email: loggedEmail,
      name: name.value.trim(),
      password: password.value.trim(),
      phone: tel.value.trim(),
      address: adresse.value.trim(),
      birthDate: birth.value.trim(),
      cin: cin.value.trim(),
      permis: permis.value.trim(),
      photo: img.src || './src/bg.webp'
    };

    const updatedAccounts = accounts.filter(acc => acc.email !== loggedEmail);
    updatedAccounts.push(updatedAccount);
    await saveUserData(updatedAccounts);
  });

  // Load email from localStorage
  email.value = localStorage.getItem('email');
  fetchUserData();

  // Resize inputs dynamically
  inputs.forEach(input => {
    const mirror = document.createElement('span');
    mirror.className = 'input-mirror';
    document.body.appendChild(mirror);

    const resizeInput = (n = 27) => {
      mirror.textContent = input.value || input.placeholder || '';
      input.style.width = `${mirror.offsetWidth + n}px`;
    };

    resizeInput();
    input.addEventListener('input', resizeInput);
    input.addEventListener('focus', resizeInput);
  });


  // Logout
  const logoutAcc = document.getElementById('logout');
  logoutAcc.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('isAdmin', 'false');
    window.location.href = './main.html';
  });

  // Enable editing
  const enableEditing = (input) => {
    inputs.forEach(i => i.disabled = true);
    input.disabled = false;
    input.focus();
  };

  // Edit buttons
  editName.addEventListener('click', () => enableEditing(name));
  editPassword.addEventListener('click', () => allowChange ? enableEditing(password) : confirmPasswordChange());
  editTel.addEventListener('click', () => enableEditing(tel));
  editAdresse.addEventListener('click', () => enableEditing(adresse));
  editBirth.addEventListener('click', () => enableEditing(birth));
  editCin.addEventListener('click', () => enableEditing(cin));
  editPermis.addEventListener('click', () => enableEditing(permis));
  editImg.addEventListener('click', () => changePhoto());

  // Tab navigation
  const displays = document.querySelectorAll('.display');
  const nav = document.querySelectorAll('.nav-item');
  const show = (id) => {
    nav.forEach(n => n.classList.toggle('clicked', n.id === id));
    displays.forEach(d => d.classList.toggle('hidden', d.id !== `${id}-display`));
  };
  nav.forEach(n => {
    if (n.id !== 'logout') {
      n.addEventListener('click', () => show(n.id));
    }
  });
  show('account');

  
});
