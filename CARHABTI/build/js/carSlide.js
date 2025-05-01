const parcContainer = document.querySelector('.parc');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');

if (!scrollLeftBtn || !scrollRightBtn) {
  console.error('Scroll buttons not found');
}

const isValidImage = (imgSrc) => {
  return typeof imgSrc === 'string' && (imgSrc.trim().startsWith('data:image/') || imgSrc.startsWith('./src/'));
};

const addBestRatedCars = async () => {
  try {
    const response = await fetch('./build/php/cars.php');
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const data = await response.json();
    console.log('Fetched data:', data);
    const carList = data.filter(car => car.crash === '0' && car.disponibility === '1');
    console.log('Filtered cars:', carList.length);
    const bestRatedCars = carList.sort((a, b) => b.rating - a.rating).slice(0, 8);

    if (bestRatedCars.length === 0) {
      console.warn('No cars to display');
      parcContainer.innerHTML = '<p>Aucune voiture disponible pour le moment.</p>';
      return;
    }

    bestRatedCars.forEach(car => {
      const carDiv = document.createElement('div');
      carDiv.classList.add('car');
      carDiv.innerHTML = `
        <img class="car-img" src="${isValidImage(car.photo) ? car.photo : './src/bg.webp'}" width="auto">
        <div>
          <h4>${car.name}</h4>
          <span class="rating inline">
        <i style="color:yellow;" class="fa-solid fa-star"></i> ${car.rating}
        <span> (${car.nbviews} avis)</span>
          </span>
          <div class="specs flex">
        <div class="column">
          <p class="passager"><i class="fa-solid fa-user"></i> ${car.capacity} Passagers</p>
          <p class="clim"><i class="fa-solid fa-snowflake"></i> ${car.climatisation === 1 ? 'Avec' : 'Sans'} climatisation</p>
        </div>
        <div class="column">
          <p class="gear"><i class="fa-solid fa-map-pin"></i> ${car.transmission}</p>
          <p class="doors"><i class="fa-solid fa-car-side"></i> ${car.doors} Portes</p>
        </div>
          </div>
        </div>
        <div class="center">
          <hr>
          <button class="reverse-btn" onclick="Reservation(${car.id})">Louer Maintenant →</button>
        </div>
      `;
      parcContainer.appendChild(carDiv);
    });
    parcContainer.offsetHeight; 
    console.log('Cars appended:', bestRatedCars.length);
    console.log('scrollWidth:', parcContainer.scrollWidth, 'clientWidth:', parcContainer.clientWidth);
  } catch (error) {
    console.error('Error fetching cars:', error);
    parcContainer.innerHTML = '<p>Erreur lors du chargement des voitures. Veuillez réessayer plus tard.</p>';
  }
};

const Reservation = (id) => {
  localStorage.setItem('selectedCarId', id);
  window.location.href = '../CARHABTI/reservation.html';
};

const autoScrollParc = () => {
  let scrollAmount = 0;
  const scrollStep = window.innerWidth < 768 ? 200 : 400;
  const scrollInterval = 4000;
  let intervalId = null;

  const scroll = () => {
    const maxScroll = parcContainer.scrollWidth - parcContainer.clientWidth;
    console.log('Scrolling:', scrollAmount, 'Max:', maxScroll);
    if (maxScroll <= 0) return;
    if (scrollAmount >= maxScroll) {
      scrollAmount = 0;
      parcContainer.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollAmount += scrollStep;
      parcContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
    updateButtonStates();
  };

  const startScrolling = () => {
    if (!intervalId) {
      intervalId = setInterval(scroll, scrollInterval);
    }
  };

  const stopScrolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const updateButtonStates = () => {
    const maxScroll = parcContainer.scrollWidth - parcContainer.clientWidth;
    scrollLeftBtn.disabled = scrollAmount <= 0;
    scrollRightBtn.disabled = scrollAmount >= maxScroll || maxScroll <= 0;
  };

  if (scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      stopScrolling();
      scrollAmount -= scrollStep;
      if (scrollAmount < 0) scrollAmount = 0;
      parcContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      updateButtonStates();
      setTimeout(startScrolling, 2000);
    });

    scrollRightBtn.addEventListener('click', () => {
      stopScrolling();
      const maxScroll = parcContainer.scrollWidth - parcContainer.clientWidth;
      scrollAmount += scrollStep;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
      parcContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      updateButtonStates();
      setTimeout(startScrolling, 2000);
    });

    parcContainer.addEventListener('mouseenter', stopScrolling);
    parcContainer.addEventListener('mouseleave', startScrolling);
    scrollLeftBtn.addEventListener('mouseenter', stopScrolling);
    scrollLeftBtn.addEventListener('mouseleave', startScrolling);
    scrollRightBtn.addEventListener('mouseenter', stopScrolling);
    scrollRightBtn.addEventListener('mouseleave', startScrolling);
  }

  const images = parcContainer.querySelectorAll('.car-img');
  let loadedImages = 0;
  if (images.length === 0) {
    console.warn('No car images found');
    startScrolling();
    updateButtonStates();
    return;
  }

  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
      if (loadedImages === images.length) {
        parcContainer.offsetHeight; 
        console.log('Images loaded, scrollWidth:', parcContainer.scrollWidth, 'clientWidth:', parcContainer.clientWidth);
        startScrolling();
        updateButtonStates();
      }
    } else {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === images.length) {
          parcContainer.offsetHeight;
          console.log('Images loaded, scrollWidth:', parcContainer.scrollWidth, 'clientWidth:', parcContainer.clientWidth);
          startScrolling();
          updateButtonStates();
        }
      });
      img.addEventListener('error', () => {
        loadedImages++;
        if (loadedImages === images.length) {
          parcContainer.offsetHeight;
          console.log('Images loaded, scrollWidth:', parcContainer.scrollWidth, 'clientWidth:', parcContainer.clientWidth);
          startScrolling();
          updateButtonStates();
        }
      });
    }
  });
};

addBestRatedCars().then(() => {
  autoScrollParc();
});