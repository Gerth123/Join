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
  
    initialsDiv.addEventListener('click', () => {
      menuDiv.style.display = (menuDiv.style.display === 'block') ? 'none' : 'block';
    });
  
    window.addEventListener('click', (event) => {
      if (!menuDiv.contains(event.target) && event.target !== initialsDiv) {
        menuDiv.style.display = 'none';
      }
    });
});