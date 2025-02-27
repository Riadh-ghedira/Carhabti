document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.getElementById('loading-screen');
  window.onload = function () {
    loadingScreen.classList.add('hidden');
  };
});
const section = document.getElementById('side-nav');
const map = document.getElementById('mapview');
const btn = document.getElementById('nav-btn');
function toggleSection() {
  if (section.style.display === 'none' || section.style.display === '') {
    section.style.display = 'flex';
    btn.style.opacity = '0';
  } else {
    section.style.display = 'none';
    btn.style.opacity = '1';
  }
}
function togglemap() {
  if (map.style.display === 'none' || map.style.display === '') {
    map.style.display = 'flex';
  } else {
    map.style.display = 'none';
  }
}
