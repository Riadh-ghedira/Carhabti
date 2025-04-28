document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const addCarForm = document.getElementById('add-car-form');
  console.log('Admin: ' + isAdmin);
  if (!isAdmin) {
    addCarForm.style.display = 'none';
    addCarForm.querySelectorAll('input, button, select').forEach((element) => {
      element.disabled = true;
    });
    return;
  }

  const addCarBtn = document.getElementById('add-car');
  const closeBtn = document.getElementById('close-add-div');
  const parc = document.querySelector('.parc');

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
  addCarForm.classList.add('hidden');

  isAdmin
    ? addCarBtn.classList.remove('hidden')
    : addCarBtn.classList.add('hidden');

  addCarBtn.addEventListener('click', showForm);
  closeBtn.addEventListener('click', closeForm);

  Object.values(formInputs).forEach((input) => {
    if (input !== formInputs.image && input !== formInputs.airCondition) {
      input.addEventListener('input', validateForm);
    }
  });

  addCarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmission();
  });

  function showForm() {
    addCarForm.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    parc.style.opacity = '0.3';
    validateForm();
  }

  function closeForm() {
    addCarForm.classList.add('fadeout');
    setTimeout(() => {
      addCarForm.classList.add('hidden');
      parc.style.opacity = '1';
      addCarForm.classList.remove('fadeout');
      document.body.style.overflow = '';
    }, 150);
  }

  function validateForm() {
    const isValid = Object.entries(formInputs).every(([key, input]) => {
      if (key === 'image' || key === 'airCondition') return true;
      return input.value.trim() !== '';
    });
    submitBtn.disabled = !isValid;
    return isValid;
  }

  const processImage = () => {
    return new Promise((resolve, reject) => {
      const file = formInputs.image.files[0];

      if (!file) {
        console.warn('No image file selected. Using default image.');
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

      const response = await fetch('./add-car.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        addCarForm.reset();
        closeForm();
        window.location.href = './reservation.html';
      } else {
        throw new Error(result.message || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add car. Please try again.');
    }
  };
});