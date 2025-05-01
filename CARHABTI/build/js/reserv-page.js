document.addEventListener('DOMContentLoaded', () => {
  const reservation = document.getElementById('reservation');
  const parc = document.getElementById('parc');
  const carImg = document.getElementById('car-img');
  const carName = document.getElementById('car-name-show');
  const carPrice = document.getElementById('car-price-show');
  const transmission = document.getElementById('transmission');
  const fuel = document.getElementById('fuel');
  const passager = document.getElementById('passager');
  const parcDiv = document.querySelector('.parc');
  let carId = document.getElementById('carId');
  let lastScrollPosition = 0;
  let carList = [];
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const email = localStorage.getItem('email') || '';

  if (!parcDiv || !reservation || !parc || !carImg || !carName || !carPrice || !transmission || !fuel || !passager) {
    console.error('Error: One or more DOM elements not found');
    return;
  }
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const isValidImage = (imgSrc) => {
    return typeof imgSrc === 'string' && imgSrc.trim() !== '' && (imgSrc.startsWith('data:image/') || imgSrc.startsWith('./src/'));
  };
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
  const setCar = (car) => {
    carImg.src = isValidImage(car.photo) ? car.photo : './src/bg.webp';
    carName.textContent = car.name;
    carPrice.textContent = car.price;
    transmission.textContent = car.transmission;
    fuel.textContent = car.fuel;
    passager.textContent = car.capacity;
    carId.value = car.id;
    console.log(`Car set: ${car.name} (ID: ${carId.value})`);
  };
  const setUser = async (email) => {
    if (!email) {
      throw new Error('No email found in localStorage');
    }
    
    const headers = new Headers();
    headers.append('X-Email', email);
    
    const response = await fetch(`./build/php/account.php?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: headers
    });
    
    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }
    
    userData = await response.json();
    
    if (userData && !userData.status) {
      document.getElementById('name').value = userData.name || '';
      document.getElementById('email').value = userData.email || email || '';
      document.getElementById('tel').value = userData.phone || '';
      document.getElementById('address').value = userData.address || '';
        
      accounts = [userData];
      
      inputs.forEach(input => {
          const event = new Event('input');
          input.dispatchEvent(event);
      });
    }
  }
  const showReservation = (id) => {
    lastScrollPosition = window.scrollY;
    const car = carList.find((car) => car.id === id || car.id === String(id));
    if (!car) {
      console.error(`Car with ID ${id} not found in carList`);
      return;
    }
    setCar(car);
    if (isLoggedIn) setUser(email);
    reservation.classList.remove('hidden');
    window.scrollTo(0, 0);
    parc.classList.add('hidden');
  };

  const showParc = () => {
    window.scrollTo(0, lastScrollPosition, { behavior: 'smooth' });
    reservation.classList.add('hidden');
    parc.classList.remove('hidden');
  };

  const createCarDiv = (car) => {
    const carDiv = document.createElement('div');
    carDiv.classList.add('car');
    carDiv.id = `car-${car.id}`;

    let statusLabel = '';
    if (isAdmin) {
      if (car.crash == 1) {
        statusLabel = '<span style="color: red; font-weight: bold;"> [Crashed]</span>';
      } else if (car.disponibility == 0) {
        statusLabel = '<span style="color: yellow; font-weight: bold;"> [Unavailable]</span>';
      }
    }

    carDiv.innerHTML = `
      <img class="car-img" src="${isValidImage(car.photo) ? car.photo : './src/bg.webp'}" width="auto">
      <div>
      <h4>${car.name}${statusLabel}</h4>
      <span class="rating inline"><i style="color:yellow;" class="fa-solid fa-star"></i> ${car.rating} <span> (${car.nbviews} avis)</span></span>
      <div class="specs flex">
        <div class="column">
        <p class="passager"><i class="fa-solid fa-user"></i> ${car.capacity} Passagers</p>
        <p class="clim"><i class="fa-solid fa-snowflake"></i> ${car.climatisation == 1 ? 'Avec' : 'Sans'} climatisation</p>
        </div>
        <div class="column">
        <p class="gear"><i class="fa-solid fa-map-pin"></i> ${car.transmission}</p>
        <p class="doors"><i class="fa-solid fa-car-side"></i> ${car.doors} portes</p>
        </div>
      </div>
      </div>
      <div class="center">
      <hr>
      ${isAdmin ?
        `<button class="reverse-btn" onclick="showUpdateForm(${car.id})">Mettre à jour →</button>` :
        `<button class="reverse-btn" onclick="showReservation(${car.id})">Louer maintenant →</button>`}
      </div>
    `;
    return carDiv;
  };

  const loadCarListFromData = async (retryCount = 0) => {
    const maxRetries = 3;
    parcDiv.innerHTML = '<p>Chargement des voitures...</p>';
    try {
      const response = await fetch('./build/php/cars.php');
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: Expected an array of cars');
      }

      carList.length = 0;
      data.forEach(car => {
        carList.push({
          id: parseInt(car.id), 
          photo: car.photo,
          name: car.name,
          price: car.price,
          climatisation: car.climatisation,
          transmission: car.transmission,
          fuel: car.fuel,
          capacity: car.capacity,
          rating: car.rating,
          nbviews: car.nbviews,
          crash: car.crash,
          disponibility: car.disponibility,
          doors: car.doors
        });
      });

      parcDiv.innerHTML = '';
      if (carList.length === 0) {
        console.warn('No cars found in the data');
        parcDiv.innerHTML = '<p>Aucune voiture disponible pour le moment.</p>';
        return;
      }
      
      const carsToDisplay = isAdmin ? carList : carList.filter(car => car.crash == '0' && car.disponibility == '1');
      
      if (carsToDisplay.length === 0) {
        console.warn('No available cars to display');
        parcDiv.innerHTML = '<p>Aucune voiture disponible pour le moment.</p>';
        return;
      }

      carsToDisplay.forEach((car) => {
        const carDiv = createCarDiv(car);
        parcDiv.appendChild(carDiv);
      });
    } catch (error) {
      console.error('Error loading cars:', error);
      if (retryCount < maxRetries) {
        console.log(`Retrying fetch (attempt ${retryCount + 1}/${maxRetries})...`);
        setTimeout(() => loadCarListFromData(retryCount + 1), 1000);
      } else {
        parcDiv.innerHTML = '<p>Erreur lors du chargement des voitures. Veuillez réessayer plus tard.</p>';
      }
    }
  };

  const loadSelectedCar = () => {
    const selectedCarId = localStorage.getItem('selectedCarId');
    if (selectedCarId) {
      if (carList.length === 0) {
        console.warn('carList is empty; cannot load selected car yet');
        return;
      }
      const car = carList.find(c => c.id == selectedCarId);
      if (car && (isAdmin || (car.crash == 0 && car.disponibility == 1))) {
        showReservation(parseInt(selectedCarId, 10));
      } else {
        console.warn(`Selected car (ID: ${selectedCarId}) is not available for non-admin users or not found`);
      }
      localStorage.removeItem('selectedCarId');
    }
  };
  
  const showUpdateForm = (id) => {
    const carId = parseInt(id);
    const car = carList.find(c => c.id === carId);
    if (!car) {
      console.error(`Car with ID ${carId} not found in carList`);
      callAlertBox('Voiture introuvable. Veuillez essayer de rafraîchir la page.', 'error');
      return;
    }

    const updateForm = document.getElementById('edit-car-form');
    if (!updateForm) {
      console.error('Update form not found.');
      callAlertBox('Erreur : Formulaire de mise à jour introuvable sur la page.', 'error');
      return;
    }

    updateForm.querySelector('#edit-car-id').value = car.id;
    updateForm.querySelector('#edit-car-name').value = car.name;
    updateForm.querySelector('#edit-car-price').value = car.price;
    updateForm.querySelector('#edit-fuel-type').value = car.fuel;
    updateForm.querySelector('#edit-passenger-capacity').value = car.capacity;
    updateForm.querySelector('#edit-transmission-select').value = car.transmission;
    updateForm.querySelector('#edit-doors').value = car.doors;
    updateForm.querySelector('#edit-crash').value = car.crash;
    updateForm.querySelector('#edit-disponibility').value = car.disponibility;
    updateForm.querySelector('#edit-air-condition').checked = car.climatisation == 1;

    updateForm.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    parc.style.opacity = '0.3';
  };

  const processImage = () => {
    return new Promise((resolve, reject) => {
      const file = document.querySelector('#edit-car-image')?.files[0];
      if (!file) {
        console.warn('No image file selected. Using default image.');
        return resolve('./src/bg.webp');
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        callAlertBox('Veuillez télécharger une image valide (JPEG, PNG ou WebP).', 'error');
        return resolve('./src/bg.webp');
      }
      if (file.size > 5 * 1024 * 1024) {
        callAlertBox('La taille de l\'image doit être inférieure à 5 Mo.', 'error');
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

  document.getElementById('close-reserv')?.addEventListener('click', showParc);
  
  document.getElementById('reservation-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    console.log(` (ID: ${carId.value})`);
    formData.set('car-id', carId.value);
    formData.set('carId', carId.value);
    formData.set('adresse', formData.get('address'));
    formData.set('email', formData.get('email') || localStorage.getItem('email') || '');
    formData.set('condition', formData.get('condition') ? '1' : '0');
    formData.set('pickup-agence', document.getElementById('pickup-agence').value  || 'Tunis');
    formData.set('return-agence', document.getElementById('return-agence').value || 'Tunis');
    formData.set('pickup-time', document.getElementById('pickup-time').value  || '08:00');
    formData.set('return-time', document.getElementById('return-time').value  || '20:00');
    formData.set('pickup-date', document.getElementById('pickup-date').value );
    formData.set('return-date', document.getElementById('return-date').value );
    
    

    const pickupDate = formData.get('pickup-date');
    const returnDate = formData.get('return-date');
    const pickupTime = formData.get('pickup-time');
    const returnTime = formData.get('return-time');

    const pickup = new Date(`${pickupDate}T${pickupTime}:00`);
    const returnD = new Date(`${returnDate}T${returnTime}:00`);
    console.log(`Pickup: ${pickup}, Return: ${returnD}`);
    if (isNaN(pickup) || isNaN(returnD) || pickup >= returnD) {
      callAlertBox('La date et l\'heure de retour doivent être après la date et l\'heure de prise en charge.', 'error');
      return;
    }

    try {
      const response = await fetch('/carhabti/CARHABTI/build/php/rent-car.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        callAlertBox('Reservation en successé! Vous recevrez un email avec tout reste de contrat.', 'success');
        showParc();
        form.reset();
      } else {
        callAlertBox(result.message || 'Failed to create reservation.', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la réservation:', error);
      callAlertBox('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
  document.getElementById('edit-car-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const imageBase64 = await processImage();

    const formData = new FormData();
    formData.append('car-id', form.querySelector('#edit-car-id').value);
    formData.append('car-name', form.querySelector('#edit-car-name').value.trim());
    formData.append('car-price', form.querySelector('#edit-car-price').value.trim());
    formData.append('car-image', imageBase64);
    if (form.querySelector('#edit-air-condition').checked) {
      formData.append('features[]', 'Air Condition');
    }
    formData.append('fuel-type', form.querySelector('#edit-fuel-type').value.trim());
    formData.append('passenger-capacity', form.querySelector('#edit-passenger-capacity').value.trim());
    formData.append('transmission', form.querySelector('#edit-transmission-select').value.trim());
    formData.append('doors', form.querySelector('#edit-doors').value.trim());
    formData.append('crash', form.querySelector('#edit-crash').value.trim());
    formData.append('disponibility', form.querySelector('#edit-disponibility').value.trim());

    try {
      const response = await fetch('/carhabti/CARHABTI/build/php/update-car.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        callAlertBox('Car updated successfully!', 'success');
        document.getElementById('edit-car-form').classList.add('fadeout');
        setTimeout(() => {
          document.getElementById('edit-car-form').classList.add('hidden');
          parc.style.opacity = '1';
          document.getElementById('edit-car-form').classList.remove('fadeout');
          document.body.style.overflow = '';
        }, 150);
        await loadCarListFromData();
      } else {
        callAlertBox(result.message || 'Failed to update car.', 'error');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      callAlertBox('An error occurred. Please try again.', 'error');
    }
  });

  window.showReservation = showReservation;
  window.showUpdateForm = showUpdateForm;

  loadCarListFromData().then(() => {
    loadSelectedCar();
  });
});