/**
 * This script manages the visibility of overlays.
 * 
 * - Clicking the addContactButton shows the main overlay.
 * - Clicking outside the main overlay or on the closeImage inside the main overlay hides the main overlay.
 * - Clicking any div with the class "edit-div" shows the edit overlay.
 * - Clicking outside the edit overlay or on the close button inside the edit overlay hides the edit overlay.
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
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';
    const userId = '-Nz90PZwt8nJ7sfe1HYl';

    const actualUsers = await loadData(`users/${userId}/contacts`);

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
async function displayContacts(contacts) {
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

  for (const contact of contacts) {
      if (contact && contact.name) {
          const contactLetter = contact.name.charAt(0).toUpperCase();

          if (contactLetter !== currentLetter) {
              currentLetter = contactLetter;
              const letterDiv = document.createElement('div');
              letterDiv.classList.add('contacts-list-letter');
              letterDiv.textContent = currentLetter;
              contactsContainer.appendChild(letterDiv);

              const separatorDiv = document.createElement('div');
              separatorDiv.classList.add('seperator-contacts-list');
              contactsContainer.appendChild(separatorDiv);
          }

          const contactHTML = await generateContactHTML(contact);
          contactsContainer.innerHTML += contactHTML;
      }
  }

  setupContactClickEvents();
}


/**
 * Speichert einen Kontakt in Firebase unter einer sequenziellen ID und fügt eine zufällig generierte Farbe hinzu.
 * 
 * @param {string} name - Der Name des Kontakts.
 * @param {string} mail - Die E-Mail des Kontakts.
 * @param {string} phone - Die Telefonnummer des Kontakts.
 * @param {string} userId - Die Benutzer-ID, unter der der Kontakt gespeichert wird.
 * 
 * Autor: Elias
 */
async function saveContact(name, mail, phone, userId) {
  const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';

  function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const contactData = {
    name,
    mail,
    phone,
    color: generateRandomColor()
  };

  const contacts = await loadData(`users/${userId}/contacts`);
  const newContactId = contacts.length;

  const response = await fetch(`${baseUrl}users/${userId}/contacts/${newContactId}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });

  if (!response.ok) {
    throw new Error('Fehler beim Speichern des Kontakts: ' + response.statusText);
  }

  return await response.json();
}

async function createContact(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const mail = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;
  let urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get('actualUsersNumber');

  try {
    const newContact = await saveContact(name, mail, phone, userId);
    clearInputFields();
    const newUrl = `/contacts.html?msg=welcome&actualUsersNumber=${userId}`;
    history.pushState(null, '', newUrl);


    // Hier wird der Code ausgeführt, nachdem der neue Kontakt gespeichert wurde
    const actualUsers = await loadData(`users/${userId}/contacts`);
    console.log("Loaded Contacts:", actualUsers);

    if (actualUsers) {
      const sortedContacts = sortContacts(actualUsers);
      displayContacts(sortedContacts);
    } else {
      console.error("Keine Kontakte im geladenen Benutzer gefunden.");
    }
  } catch (error) {
    console.error('Fehler beim Speichern des Kontakts:', error);
  }
}
