document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.getElementById('loading-screen');
  window.onload = function () {
    loadingScreen.classList.add('hidden');
  };
});
const section = document.getElementById('side-nav');
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
