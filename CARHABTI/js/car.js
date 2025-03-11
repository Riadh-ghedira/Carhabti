class Car {
  constructor(id, img, name, price, climatisation, transmission, fuel, passager, rating, reviewNumber) {
    this.id = id;
    this.img = img;
    this.name = name;
    this.price = price;
    this.climatisation = climatisation;
    this.transmission = transmission;
    this.fuel = fuel;
    this.passager = passager;
    this.rating = rating;
    this.reviewNumber = reviewNumber;
  }
}

const carList = [];
let currentId = 0;

const addCar = (img, name, price, climatisation, transmission, fuel, passager, rating, reviewNumber) => {
  carList.push(new Car(currentId++, img, name, price, climatisation, transmission, fuel, passager, rating, reviewNumber));
};

const loadCarList = (json) => {
  const data = JSON.parse(json);
  data.forEach((car) => {
    carList.push(new Car(car.id, car.img, car.name, car.price, car.climatisation, car.transmission, car.fuel, car.passager, car.rating, car.reviewNumber));
    if (car.id >= currentId) {
      currentId = car.id + 1;
    }
  });
};

const removeCar = (id) => {
  const index = carList.findIndex(car => car.id === id);
  if (index !== -1) {
    carList.splice(index, 1);
  }
};

const saveCarList = () => {
  const json = JSON.stringify(carList);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'car.json';
  a.click();
  URL.revokeObjectURL(url);
};