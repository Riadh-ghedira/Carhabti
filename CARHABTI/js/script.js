document.addEventListener('DOMContentLoaded', function () {
  const loadingScreen = document.getElementById('loading-screen');
  window.onload = function () {
    loadingScreen.classList.add('hidden');
  };
});
var section = document.getElementById('side-nav');
function toggleSection() {
  if (section.style.display === 'none' || section.style.display === '') {
    section.style.display = 'flex';
  } else {
    section.style.display = 'none';
  }
}
