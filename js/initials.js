/**
 * Listens for the DOMContentLoaded event and sets up click event listeners.
 * Clicking initialsDiv toggles the menuDiv display.
 * Clicking outside menuDiv or initialsDiv hides menuDiv.
 * 
 * Author: Elias
 */
document.addEventListener('DOMContentLoaded', () => {
  const initialsDiv = document.querySelector('.initials');
  const menuDiv = document.querySelector('.menu');
  menuDiv.style.display = 'none';
  menuDiv.style.opacity = '1';
  initialsDiv.addEventListener('click', () => {
    if (menuDiv.classList.contains('show')) {
      menuDiv.classList.remove('show');
      setTimeout(() => {
        menuDiv.style.display = 'none';
      }, 10);
    } else {
      menuDiv.style.display = 'block';
      setTimeout(() => {
        menuDiv.classList.add('show');
      }, 10);
    }
  });

  window.addEventListener('click', (event) => {
    if (!menuDiv.contains(event.target) && event.target !== initialsDiv) {
      menuDiv.classList.remove('show');
      setTimeout(() => {
        menuDiv.style.display = 'none';
      }, 10);
    }
  });
});