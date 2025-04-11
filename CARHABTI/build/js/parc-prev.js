const parcContainer = document.querySelector('.parc');

const isValidImage = (imgSrc) => {
  return typeof imgSrc === 'string' && imgSrc.trim().length > 20 || imgSrc.startsWith('./src/');
};

const addBestRatedCars = async (filePath) => {
  const response = await fetch(filePath);
  const data = await response.json();

  const bestRatedCars = data.sort((a, b) => b.rating - a.rating).slice(0, 8);

  bestRatedCars.forEach(car => {
    const carDiv = document.createElement('div');
    carDiv.classList.add('car');
    carDiv.innerHTML = `
      <img class="car-img" src="${isValidImage(car.img) ? car.img : './src/bg.webp'}" width="auto">
      <div>
        <h4>${car.name}</h4>
        <span class="rating inline">
          <i style="color:yellow;" class="fa-solid fa-star"></i> ${car.rating}
          <span> (${car.reviewNumber} reviews)</span>
        </span>
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
        <button class="reverse-btn" onclick="Reservation(${car.id})">Rent Now →</button>
      </div>
    `;
    parcContainer.appendChild(carDiv);
  });
};



const Reservation = (id) => {
  localStorage.setItem('selectedCarId', id);
  window.location.href = '../CARHABTI/reservation.html';
};

const autoScrollParc = () => {
  let scrollAmount = 0;
  const scrollStep = 400;
  const scrollInterval = 4000;
  const maxScroll = parcContainer.scrollWidth - parcContainer.clientWidth;

  const scroll = () => {
    if (scrollAmount >= maxScroll) {
      scrollAmount = 0;
      parcContainer.scrollLeft = 0;
    } else {
      scrollAmount += scrollStep;
      parcContainer.scrollLeft += scrollStep;
    } 
  };

  setInterval(scroll, scrollInterval);
};

parcContainer.addEventListener('mouseenter', () => {
  clearInterval(autoScrollParc);
});

parcContainer.addEventListener('mouseleave', () => {
  autoScrollParc();
});

addBestRatedCars('./data/car.json').then(() => {
  autoScrollParc();
});
