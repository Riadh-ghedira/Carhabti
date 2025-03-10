class Car {
  constructor(img, name, price, climatisation, transmission, fuel) {
    this.img = img;
    this.name = name;
    this.price = price;
    this.climatisation = climatisation;
    this.transmission = transmission;
    this.fuel = fuel;
    this.personne = personne;
  }
}
const reservation = document.getElementById('reservation');
const parc = document.getElementById('parc');

const carImg = document.getElementById('car-img');
const carName = document.getElementById('car-name');
const carPrice = document.getElementById('car-price');
const transmission = document.getElementById('transmission');
const fuel = document.getElementById('fuel');
const personne = document.getElementById('personne');

const setCar = (car) => {
  carImg.src = car.img;
  carName.textContent = car.name;
  carPrice.textContent = car.price;
  transmission.textContent = car.transmission;
  fuel.textContent = car.fuel;
  personne.textContent = car.personne;
};

const showReservation = (img, name, price, climatisation, transmission, fuel) => {
  setCar(new Car(img, name, price, climatisation, transmission, fuel));
  reservation.classList.remove('hidden');
  parc.classList.add('hidden');
};

const showParc = () => {
  reservation.classList.add('hidden');
  parc.classList.remove('hidden');
};

const carsData = [
  {
    img: './src/car-4.webp',
    name: 'Renault Megane',
    price: '100DT',
    climatisation: 'Oui',
    transmission: 'Auto',
    fuel: 'Essence'
  },
  {
    img: './src/car-1.webp',
    name: 'Dacia Logan',
    price: '80DT',
    climatisation: 'Non',
    transmission: 'Manuelle',
    fuel: 'Diesel'
  },
 
];

const createCarDiv = (car, index) => {
  const carDiv = document.createElement('div');
  carDiv.classList.add('car');
  carDiv.id = `car-${index}`;
  carDiv.innerHTML = `
    <img class="car-img" src="${car.img}" width="auto">
    <div>
      <h4>${car.name}</h4>
      <span class="rating inline"><i></i> 4.8 <span> (2.436 reviews)</span></span>
      <div class="specs flex">
        <div class="column">
          <p class="passager">4 Passagers</p>
          <p class="clim">${car.climatisation}</p>
        </div>
        <div class="column">
          <p class="gear">${car.transmission}</p>
          <p class="doors">4 Doors</p>
        </div>
      </div>
    </div>
    <div class="center">
      <hr>
      <button class="reverse-btn" onclick="showReservation('${car.img}', '${car.name}', '${car.price}', '${car.climatisation}', '${car.transmission}', '${car.fuel}')">Rent Now →</button>
    </div>
  `;
  return carDiv;
};

const parcDiv = document.querySelector('.parc');
carsData.forEach((car, index) => {
  const carDiv = createCarDiv(car, index);
  parcDiv.appendChild(carDiv);
});
