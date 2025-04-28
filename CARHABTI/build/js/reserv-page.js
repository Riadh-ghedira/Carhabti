document.addEventListener('DOMContentLoaded', () => {
  const reservation = document.getElementById('reservation');
  const editCarForm = document.getElementById('edit-car-form');
  const parc = document.getElementById('parc');
  const carImg = document.getElementById('car-img');
  const carName = document.getElementById('car-name-show');
  const carPrice = document.getElementById('car-price-show');
  const transmission = document.getElementById('transmission');
  const fuel = document.getElementById('fuel');
  const passager = document.getElementById('passager');
  const parcDiv = document.querySelector('.parc');
  let lastScrollPosition = 0;
  let carList = [];
  editCarForm.classList.add('hidden');
  if (!parcDiv || !reservation || !parc || !carImg || !carName || !carPrice || !transmission || !fuel || !passager) {
    console.error('Error: One or more DOM elements not found');
    return;
  }

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const isValidImage = (imgSrc) => {
    return typeof imgSrc === 'string' && imgSrc.trim() !== '' && (imgSrc.startsWith('data:image/') || imgSrc.startsWith('./src/'));
  };

  const setCar = (car) => {
    carImg.src = isValidImage(car.photo) ? car.photo : './src/bg.webp';
    carName.textContent = car.name;
    carPrice.textContent = car.price;
    transmission.textContent = car.transmission;
    fuel.textContent = car.fuel;
    passager.textContent = car.capacity;
  };
  showUpdateForm = (id) => {
  };
  const showReservation = (id) => {
    lastScrollPosition = window.scrollY;
    const car = carList.find((car) => car.id === id || car.id === String(id));
    if (!car) {
      console.error(`Car with ID ${id} not found in carList`);
      return;
    }
    setCar(car);
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
        <span class="rating inline"><i style="color:yellow;" class="fa-solid fa-star"></i> ${car.rating} <span> (${car.nbviews} reviews)</span></span>
        <div class="specs flex">
          <div class="column">
            <p class="passager"><i class="fa-solid fa-user"></i> ${car.capacity} Passagers</p>
            <p class="clim"><i class="fa-solid fa-snowflake"></i> ${car.climatisation == 1 ? 'With' : 'No'} climatisation</p>
          </div>
          <div class="column">
            <p class="gear"><i class="fa-solid fa-map-pin"></i> ${car.transmission}</p>
            <p class="doors"><i class="fa-solid fa-car-side"></i> ${car.doors} Doors</p>
          </div>
        </div>
      </div>
      <div class="center">
        <hr>
        ${isAdmin ?
        `<button class="reverse-btn" onclick="showUpdateForm(${car.id})">Update Status →</button>` :
        `<button class="reverse-btn" onclick="showReservation(${car.id})">Rent Now →</button>`}
      </div>
    `;
    return carDiv;
  };

  const loadCarListFromData = async () => {
    try {
      const response = await fetch('./build/php/cars.php');
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: Expected an array of cars');
      }

      console.log('Cars data:', data);

      carList.length = 0;
      data.forEach(car => {
        carList.push({
          id: car.id,
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
          disponibility: car.disponibility
        });
      });

      if (carList.length === 0) {
        console.warn('No cars found in the data');
        parcDiv.innerHTML = '<p>No cars available at the moment.</p>';
        return;
      }

      const carsToDisplay = isAdmin ? carList : carList.filter(car => car.crash == '0' && car.disponibility == '1');

      if (carsToDisplay.length === 0) {
        console.warn('No available cars to display');
        parcDiv.innerHTML = '<p>No cars available at the moment.</p>';
        return;
      }

      carsToDisplay.forEach((car) => {
        const carDiv = createCarDiv(car);
        parcDiv.appendChild(carDiv);
      });
    } catch (error) {
      console.error('Error loading cars:', error);
      parcDiv.innerHTML = '<p>Error loading cars. Please try again later.</p>';
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

  loadCarListFromData().then(() => {
    loadSelectedCar();
  });
});