document.addEventListener("DOMContentLoaded", function () {
  const addContactButton = document.querySelector(".addContactButton");
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
  const closeImage = document.querySelector(".imgcloseOverlay");
  const cancelButton = document.querySelector(".clearButton");
  const contactForm = document.getElementById("contactForm");

  const editDivs = document.querySelectorAll(".edit-div");
  const editOverlay = document.getElementById("edit-overlay");
  const closeEditOverlay = document.querySelector(".closeEditOverlay");
  const editContactForm = document.getElementById("editContactForm");

  const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';
  const userId = '-NyKF7omq8KOQgBXWhYW';

  editDivs.forEach(editDiv => {
    editDiv.addEventListener("click", function (event) {
      event.stopPropagation();
      editOverlay.style.display = "block";
    });
  });

  addContactButton.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    if (overlay.style.display === "block" && !mainSectionOverlay.contains(event.target)) {
      overlay.style.display = "none";
    }
    if (editOverlay.style.display === "block" && !editOverlay.contains(event.target)) {
      editOverlay.style.display = "none";
    }
  });

  closeImage.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "none";
  });

  closeEditOverlay.addEventListener("click", function (event) {
    event.stopPropagation();
    editOverlay.style.display = "none";
  });

  cancelButton.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "none";
    contactForm.reset();
  });

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const phone = document.getElementById("contactPhone").value;

    await fetch(`${baseUrl}${userId}/contacts.json`, {
      method: "POST",
      body: JSON.stringify({ name, email, phone }),
    });

    overlay.style.display = "none";
    contactForm.reset();
    // Reload or update the contacts list
  });

  editContactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("editContactName").value;
    const email = document.getElementById("editContactEmail").value;
    const phone = document.getElementById("editContactPhone").value;

    // Assuming you have a way to get the current contact ID
    const contactId = "contact-id";

    await fetch(`${baseUrl}${userId}/contacts/${contactId}.json`, {
      method: "PUT",
      body: JSON.stringify({ name, email, phone }),
    });

    editOverlay.style.display = "none";
    editContactForm.reset();
    // Reload or update the contacts list
  });
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
      const userId = '-NyKF7omq8KOQgBXWhYW';

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


/**
 * Sorts contacts alphabetically by name.
 * 
 * @param {Array<Object>} contacts - Array of contact objects.
 * @returns {Array<Object>} Sorted contacts.
 * 
 * Author: Elias
 */
function sortContacts(contacts) {
  if (!Array.isArray(contacts)) {
      console.error("Contacts is not an array:", contacts);
      return [];
  }

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
  contacts.forEach(contact => {
      if (contact && contact.name) {
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
      }
  });

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
  
  const contacts = await loadData(`users/${userId}/contacts`, baseUrl);
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

async function loadData(path, baseUrl) {
  const response = await fetch(`${baseUrl}${path}.json`);
  if (!response.ok) {
      throw new Error('Fehler beim Laden der Daten: ' + response.statusText);
  }
  return await response.json();
}