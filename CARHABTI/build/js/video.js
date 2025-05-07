document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('videoSeen') === 'true') {
      return; 
    }
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = '0'; 
    overlay.style.transition = 'opacity 0.5s ease'; 
  
    const modal = document.createElement('div');
    modal.style.position = 'relative';
    modal.style.backgroundColor = '#000';
    modal.style.borderRadius = '10px';
    modal.style.padding = '0';
    modal.style.overflow = 'hidden';
    modal.style.width = '80%';
    modal.style.maxWidth = '800px';
    modal.style.transform = 'scale(0.8)'; 
    modal.style.transition = 'transform 0.5s ease';
    
    const video = document.createElement('video');
    video.src = 'video/car.mp4'; 
    video.autoplay = true;
    video.controls = false;
    video.style.width = '100%';
    video.style.height = 'auto';
    video.style.display = 'block';
  
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '24px';
    closeButton.style.background = 'transparent';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001';
  
    closeButton.addEventListener('click', function() {
      overlay.style.opacity = '0';
      modal.style.transform = 'scale(0.8)';
      setTimeout(() => {
        overlay.remove();
      }, 500);
      localStorage.setItem('videoSeen', 'true');
    });
    modal.appendChild(closeButton);
    modal.appendChild(video);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    setTimeout(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    }, 50);
  });
  