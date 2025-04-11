const reservation = document.getElementById('reservation');
const parc = document.getElementById('parc');
const carImg = document.getElementById('car-img');
const carName = document.getElementById('car-name');
const carPrice = document.getElementById('car-price-show');
const transmission = document.getElementById('transmission');
const fuel = document.getElementById('fuel');
const passager = document.getElementById('passager');
const parcDiv = document.querySelector('.parc');
let lastScrollPosition = 0;
 

const isValidImage = (imgSrc) => {
  return typeof imgSrc === 'string' && imgSrc.trim().length > 20 || imgSrc.startsWith('./src/');
};



const setCar = (car) => {
  carImg.src = isValidImage(car.img) ? car.img : './src/bg.webp'
  carName.textContent = car.name;
  carPrice.textContent = car.price;
  transmission.textContent = car.transmission;
  fuel.textContent = car.fuel;
  passager.textContent = car.passager;
};

const showReservation = (id) => {
  lastScrollPosition = window.scrollY;
  const car = carList.find((car) => car.id === id);
  setCar(car);
  reservation.classList.remove('hidden');
  window.scrollTo(0, 0);
  parc.classList.add('hidden');
};

const showParc = () => {
  window.scrollTo(0, lastScrollPosition ,{ behavior: 'smooth' });
  reservation.classList.add('hidden');
  parc.classList.remove('hidden');

};

const createCarDiv = (car) => {
  const carDiv = document.createElement('div');
  carDiv.classList.add('car');
  carDiv.id = `car-${car.id}`;
  carDiv.innerHTML = `
    <img class="car-img" src="${isValidImage(car.img) ? car.img : './src/bg.webp'}" width="auto">
      <div>
    <div>
      <h4>${car.name}</h4>
      <span class="rating inline"><i style="color:yellow;" class="fa-solid fa-star"></i> ${car.rating} <span> (${car.reviewNumber} reviews)</span></span>
      <div class="specs flex">
        <div class="column">
          <p class="passager"><i class="fa-solid fa-user"></i> ${car.passager} Passagers</p>
          <p class="clim"><i class="fa-solid fa-snowflake"></i> ${car.climatisation} climatisation</p>
        </div>
        <div class="column">
          <p class="gear"><i class="fa-solid fa-map-pin"></i> ${car.transmission}</p>
          <p class="doors"><i class="fa-solid fa-car-side"></i> 4 Doors</p>
        </div>
      </div>
    </div>
    <div class="center">
      <hr>
      <button class="reverse-btn" onclick="showReservation(${car.id})">Rent Now →</button>
    </div>
  `;
  return carDiv;
};


const loadCarListFromData = async (filePath) => {
  const response = await fetch(filePath);
  const data = await response.json();
  data.forEach(car => {
    carList.push(new Car(car.id, car.img, car.name, car.price, car.climatisation, car.transmission, car.fuel, car.passager, car.rating, car.reviewNumber));
  });
  carList.forEach((car) => {
    const carDiv = createCarDiv(car);
    parcDiv.appendChild(carDiv);
  });
};

const loadSelectedCar = () => {
  const selectedCarId = localStorage.getItem('selectedCarId');
  if (selectedCarId) {
    showReservation(parseInt(selectedCarId, 10));
    localStorage.removeItem('selectedCarId');
  }
};

loadCarListFromData('./data/car.json').then(() => {
  loadSelectedCar();
});

