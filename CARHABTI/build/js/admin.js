document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  console.log('Admin status:', isAdmin);

  const addCarForm = document.getElementById('add-car-form');
  const editCarForm = document.getElementById('edit-car-form');
  const addCarContainer = document.getElementById('add-car');
  const addCarBtn = document.getElementById('add-car-btn');
  const closeBtn = document.getElementById('close-add-div');
  const closeEditBtn = document.getElementById('close-edit-div');
  const parc = document.querySelector('.parc');

  if (!addCarContainer || !addCarBtn || !addCarForm || !parc) {
    console.error('Missing required DOM elements:', {
      addCarContainer: !!addCarContainer,
      addCarBtn: !!addCarBtn,
      addCarForm: !!addCarForm,
      parc: !!parc
    });
    return;
  }

  if (editCarForm) editCarForm.classList.add('hidden');
  if (addCarForm) addCarForm.classList.add('hidden');

  if (!isAdmin) {
    addCarContainer.classList.add('hidden');
    addCarForm.querySelectorAll('input, button, select').forEach((element) => {
      element.disabled = true;
    });
    console.log('Non-admin user: Add car container hidden');
    return;
  }
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
  addCarContainer.classList.remove('hidden');
  console.log('Admin user: Add car container shown');

  const formInputs = {
    name: document.getElementById('car-name'),
    price: document.getElementById('car-price'),
    image: document.getElementById('car-image'),
    airCondition: document.getElementById('air-condition'),
    fuelType: document.getElementById('fuel-type'),
    passengerCapacity: document.getElementById('passenger-capacity'),
    transmission: document.getElementById('transmission-select'),
  };

  const submitBtn = addCarForm.querySelector('button[type="submit"]');

  addCarBtn.addEventListener('click', () => {
    console.log('Add car button clicked');
    addCarForm.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    parc.style.opacity = '0.3';
    validateForm();
  });

  closeBtn?.addEventListener('click', () => {
    close(addCarForm);
  });
 const close = (form)=>{
  form.classList.add('fadeout');
    setTimeout(() => {
      form.classList.add('hidden');
      parc.style.opacity = '1';
      form.classList.remove('fadeout');
      document.body.style.overflow = '';
    }, 150);
 }
  closeEditBtn?.addEventListener('click', () => {
    close(editCarForm);
  });

  Object.values(formInputs).forEach((input) => {
    if (input && input !== formInputs.image && input !== formInputs.airCondition) {
      input.addEventListener('input', validateForm);
    }
  });

  addCarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Add car form submitted');
    await handleFormSubmission();
  });

  function validateForm() {
    const isValid = Object.entries(formInputs).every(([key, input]) => {
      if (!input || key === 'image' || key === 'airCondition') return true;
      return input.value.trim() !== '';
    });
    if (submitBtn) submitBtn.disabled = !isValid;
    return isValid;
  }

  const processImage = () => {
    return new Promise((resolve, reject) => {
      const file = formInputs.image?.files[0];
      if (!file) {
        console.warn('No image file selected. Using default image.');
        return resolve('./src/bg.webp');
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        callAlertBox('Please upload a valid image (JPEG, PNG, or WebP).', 'error');
        return resolve('./src/bg.webp');
      }
      if (file.size > 5 * 1024 * 1024) {
        callAlertBox('Image size must be less than 5MB.' , 'error');
        return resolve('./src/bg.webp');
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        console.error('Error reading image:', error);
        resolve('./src/bg.webp');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmission = async () => {
    if (!validateForm()) return;

    try {
      const imageBase64 = await processImage();

      const formData = new FormData();
      formData.append('car-name', formInputs.name.value.trim());
      formData.append('car-price', formInputs.price.value.trim());
      formData.append('car-image', imageBase64);
      if (formInputs.airCondition.checked) {
        formData.append('features[]', 'Air Condition');
      }
      formData.append('fuel-type', formInputs.fuelType.value.trim());
      formData.append('passenger-capacity', formInputs.passengerCapacity.value.trim());
      formData.append('transmission', formInputs.transmission.value.trim());

      const response = await fetch('/carhabti/CARHABTI/build/php/add-car.php', {
        method: 'POST',
        body: formData,
      });

      const resultText = await response.text();
      console.log('Response:', resultText);
      let result;
      result = JSON.parse(resultText);
      console.log('Parsed response:', result);
      if (result.success) {
        callAlertBox('Car added successfully!' , 'success');
        addCarForm.classList.add('fadeout');
        setTimeout(() => {
          addCarForm.classList.add('hidden');
          parc.style.opacity = '1';
          addCarForm.classList.remove('fadeout');
          document.body.style.overflow = '';
        }, 150);
        window.location.href = './reservation.html';
      } else {
        throw new Error(result.message || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error:', error);
      callAlertBox('Failed to add car. Please try again.' , 'error');
    }
  };
});