/**
 * This script manages the visibility of an overlay.
 * 
 * - Clicking the addContactButton shows the overlay.
 * - Clicking outside the overlay or on the closeImage inside the overlay hides the overlay.
 * 
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", function () {
  const addContactButton = document.querySelector(".addContactButton");
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
  const closeImage = document.querySelector(".imgcloseOverlay");
  const cancelButton = document.querySelector(".clearButton");

  addContactButton.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    if (overlay.style.display === "block" && !mainSectionOverlay.contains(event.target)) {
      overlay.style.display = "none";
    }
  });

  closeImage.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "none";
  });

  cancelButton.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "none";
    clearInputFields();
  });

  const contactsADiv = document.querySelector('.contactsA');
  if (contactsADiv) {
    contactsADiv.addEventListener('click', () => {
      contactsADiv.classList.toggle('active');
    });
  }
});

/**
 * This function clears the text in the input fields for contact name, email, and phone.
 * It retrieves the input elements by their respective IDs and sets their values to an empty string.
 * 
 * Author: Elias
 */
function clearInputFields() {
  const contactNameInput = document.getElementById("contactName");
  const contactEmailInput = document.getElementById("contactEmail");
  const contactPhoneInput = document.getElementById("contactPhone");

  contactNameInput.value = "";
  contactEmailInput.value = "";
  contactPhoneInput.value = "";
}

/**
 * Fetches and displays sorted user contacts from Firebase when the DOM is fully loaded.
 * 
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", async function() {
  try {
      const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';
      let urlParams = new URLSearchParams(window.location.search);
      let userId = urlParams.get('actualUsersNumber');

      const actualUsers = await loadData(`users/${userId}/contacts`, baseUrl);
      console.log("Loaded Contacts:", actualUsers);

      if (actualUsers) {
          const sortedContacts = sortContacts(actualUsers);
          displayContacts(sortedContacts);
      } else {
          console.error("Keine Kontakte im geladenen Benutzer gefunden.");
      }
  } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
  }
});

/**
 * Fetches data from a given path in the Firebase database.
 * 
 * @param {string} path - The path to fetch data from.
 * @param {string} baseUrl - The base URL of the Firebase database.
 * @returns {Promise<Object>} The JSON response.
 * 
 * Author: Elias
 */
async function loadData(path='', baseUrl) {
  const response = await fetch(`${baseUrl}${path}.json`);
  if (!response.ok) {
      throw new Error('Fehler beim Laden der Daten: ' + response.statusText);
  }
  return await response.json();
}

/**
 * Sorts contacts alphabetically by name.
 * 
 * @param {Array<Object>} contacts - Array of contact objects.
 * @returns {Array<Object>} Sorted contacts.
 * 
 * Author: Elias
 */
function sortContacts(contacts) {
  contacts.sort((a, b) => {
      if (a !== null && b !== null) {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
              return -1;
          }
          if (nameA > nameB) {
              return 1;
          }
      } else if (a === null && b !== null) {
          return 1;
      } else if (a !== null && b === null) {
          return -1;
      }
      return 0;
  });
  return contacts;
}

/**
 * Displays sorted contacts in the HTML container, grouped by the first letter.
 * 
 * @param {Array<Object>} contacts - Sorted contact objects.
 * 
 * Author: Elias
 */
function displayContacts(contacts) {
  const contactsContainer = document.getElementById('contacts-container');
  if (!contactsContainer) {
      console.error("Das Container-Element für Kontakte wurde nicht gefunden.");
      return;
  }
  if (!contacts || contacts.length === 0) {
      console.error("Keine Kontakte gefunden.");
      return;
  }

  contactsContainer.innerHTML = '';
  let currentLetter = '';

  contacts.forEach(contact => {
      const contactLetter = contact.name.charAt(0).toUpperCase();

      if (contactLetter !== currentLetter) {
          currentLetter = contactLetter;
          contactsContainer.innerHTML += `
            <div class="contacts-list-letter">${currentLetter}</div>
            <div class="seperator-contacts-list"></div>
          `;
      }

      const contactHTML = generateContactHTML(contact);
      contactsContainer.innerHTML += contactHTML;
  });

  setupContactClickEvents();
}