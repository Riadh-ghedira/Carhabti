document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const addCarForm = document.getElementById('add-car-form');
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
    transmission: document.getElementById('transmission'),
  };
  const submitBtn = addCarForm.querySelector('button[type="submit"]');

  addCarForm.classList.add('hidden');
  isAdmin
    ? addCarBtn.classList.remove('hidden')
    : addCarBtn.classList.add('hidden');
  if (!isAdmin) {
    addCarForm.style.display = 'none';
  }

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

  async function handleFormSubmission() {
    if (!validateForm()) return;

    try {
      const newCar = {
        id: Date.now(),
        img: await processImage(),
        name: formInputs.name.value.trim(),
        price: `${formInputs.price.value.trim()}DT`,
        climatisation: formInputs.airCondition.checked ? 'Avec' : 'Sans',
        transmission: formInputs.transmission.value.trim(),
        fuel: formInputs.fuelType.value.trim(),
        passager: formInputs.passengerCapacity.value.trim(),
        rating: 0,
        reviewNumber: 0,
      };

      const cars = await fetchCarData();
      cars.push(newCar);
      await saveCarData(cars);

      addCarForm.reset();
      closeForm();
      window.location.href = './reservation.html';
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add car. Please try again.');
    }
  }

  async function processImage() {
    if (formInputs.image.files[0]) {
      return URL.createObjectURL(formInputs.image.files[0]);
    }
    return './src/bg.webp';
  }

  async function fetchCarData() {
    const response = await fetch('./data/car.json');
    if (!response.ok) throw new Error('Failed to fetch car data');
    return await response.json();
  }

  async function saveCarData(cars) {
    const filePath = './data/car.json';

    // Create a new Blob for the updated car data
    const blob = new Blob([JSON.stringify(cars, null, 2)], {
      type: 'application/json',
    });

    // Use the File System Access API to save the file in the same directory
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'car.json',
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      console.log(`File saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save the file. Please try again.');
    }
  }
});
