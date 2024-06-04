/**
 * Sets up event listeners for the contact management interface.
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", function () {
  setupAddContactButton();
  setupDocumentClickListener();
  setupCloseImageListener();
  setupCancelButtonListener();
  setupContactsAListener();
});

/**
 * Sets up the event listener for the add contact button.
 * Author: Elias
 */
function setupAddContactButton() {
  const addContactButton = document.querySelector(".addContactButton");
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");

  addContactButton.addEventListener("click", function (event) {
    event.stopPropagation();
    overlay.style.display = "flex";
    mainSectionOverlay.classList.remove("overlay-closed");
  });
}

/**
 * Sets up the event listener for clicks on the document.
 * Author: Elias
 */
function setupDocumentClickListener() {
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");

  document.addEventListener("click", function (event) {
    if (overlay.style.display === "flex" && !mainSectionOverlay.contains(event.target)) {
      overlay.style.display = "none";
    }
  });
}

/**
 * Sets up the event listener for the close image.
 * Author: Elias
 */
function setupCloseImageListener() {
  const closeImage = document.querySelector(".imgcloseOverlay");
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");

  closeImage.addEventListener("click", function (event) {
    event.stopPropagation();
    mainSectionOverlay.classList.add("overlay-closed");
    setTimeout(function () {
      overlay.style.display = "none";
    }, 850);
  });
}

/**
 * Sets up the event listener for the cancel button.
 * Author: Elias
 */
function setupCancelButtonListener() {
  const cancelButton = document.querySelector(".clearButton");
  const overlay = document.getElementById("overlay");
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");

  cancelButton.addEventListener("click", function (event) {
    event.stopPropagation();
    mainSectionOverlay.classList.add("overlay-closed");
    setTimeout(function () {
      overlay.style.display = "none";
    }, 850);
    clearInputFields();
  });
}

/**
 * Sets up the event listener for the contactsA div.
 * Author: Elias
 */
function setupContactsAListener() {
  const contactsADiv = document.querySelector(".contactsA");
  if (contactsADiv) {
    contactsADiv.addEventListener("click", () => {
      contactsADiv.classList.toggle("active");
    });
  }
}

/**
 * Clears input fields in the contact form.
 * Author: Elias
 */
function clearInputFields() {
  document.querySelectorAll(".inputField").forEach((input) => (input.value = ""));
}

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
    let userId = await getUserIdFormUrl();
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
 * Author: Elias
 * @param {Array<Object>} contacts - Sorted contact objects.
 */
async function displayContacts(contacts) {
  const contactsContainer = getContactsContainer();
  if (!contactsContainer) return;

  if (!contacts || contacts.length === 0) {
    console.error("Keine Kontakte gefunden.");
    return;
  }

  clearContactsContainer(contactsContainer);
  await populateContacts(contacts, contactsContainer);
  setupContactClickEvents();
}

/**
 * Gets the contacts container element.
 * Author: Elias
 * @returns {HTMLElement} - The contacts container element.
 */
function getContactsContainer() {
  const contactsContainer = document.getElementById("contacts-container");
  if (!contactsContainer) {
    console.error("Das Container-Element für Kontakte wurde nicht gefunden.");
  }
  return contactsContainer;
}

/**
 * Clears the contacts container.
 * Author: Elias
 * @param {HTMLElement} container - The contacts container element.
 */
function clearContactsContainer(container) {
  container.innerHTML = "";
}

/**
 * Populates the contacts container with sorted contacts.
 * Author: Elias
 * @param {Array<Object>} contacts - Sorted contact objects.
 * @param {HTMLElement} container - The contacts container element.
 */
async function populateContacts(contacts, container) {
  let currentLetter = "";
  for (const contact of contacts) {
    if (contact && contact.name) {
      const contactLetter = contact.name.charAt(0).toUpperCase();
      if (contactLetter !== currentLetter) {
        currentLetter = contactLetter;
        addLetterHeader(container, currentLetter);
      }
      const contactHTML = await generateContactHTML(contact);
      container.innerHTML += contactHTML;
    }
  }
}

/**
 * Adds a letter header to the contacts container.
 * Author: Elias
 * @param {HTMLElement} container - The contacts container element.
 * @param {string} letter - The letter to add as header.
 */
function addLetterHeader(container, letter) {
  const letterDiv = createLetterDiv(letter);
  container.appendChild(letterDiv);

  const separatorDiv = createSeparatorDiv();
  container.appendChild(separatorDiv);
}

/**
 * Creates a letter div element.
 * Author: Elias
 * @param {string} letter - The letter to display.
 * @returns {HTMLElement} - The letter div element.
 */
function createLetterDiv(letter) {
  const letterDiv = document.createElement("div");
  letterDiv.classList.add("contacts-list-letter");
  letterDiv.textContent = letter;
  return letterDiv;
}

/**
 * Creates a separator div element.
 * Author: Elias
 * @returns {HTMLElement} - The separator div element.
 */
function createSeparatorDiv() {
  const separatorDiv = document.createElement("div");
  separatorDiv.classList.add("seperator-contacts-list");
  return separatorDiv;
}

/**
 * Saves a contact in Firebase under a sequential ID and adds a randomly generated color.
 * Author: Elias
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} userId - The user ID under which the contact is saved.
 */
async function saveContact(name, mail, phone, userId) {
  const baseUrl = "https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/";
  const contactData = createContactData(name, mail, phone);
  const newContactId = await findFirstMissingId(userId);
  const response = await saveContactToFirebase(baseUrl, userId, newContactId, contactData);

  if (!response.ok) {
    throw new Error("Error saving contact: " + response.statusText);
  }

  return await response.json();
}

/**
 * Generates a random color in hexadecimal format.
 * Author: Elias
 * @returns {string} - A random hexadecimal color.
 */
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Creates a contact data object with a random color.
 * Author: Elias
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {Object} - The contact data object.
 */
function createContactData(name, mail, phone) {
  return {
    name,
    mail,
    phone,
    color: generateRandomColor(),
  };
}

/**
 * Loads contact data from Firebase.
 * Author: Elias
 * @param {string} path - The path to the data in Firebase.
 * @returns {Promise<Object>} - The loaded contact data.
 */
async function loadData(path) {
  const response = await fetch(`${baseUrl}${path}.json`);
  if (!response.ok) {
    throw new Error("Error loading data: " + response.statusText);
  }
  return await response.json();
}

/**
 * Finds the first missing ID for a new contact.
 * Author: Elias
 * @param {string} userId - The user ID under which the contacts are stored.
 * @returns {Promise<number>} - The first missing ID.
 */
// async function findFirstMissingId(userId) {
//   const contacts = await loadData(`users/${userId}/contacts`);
//   let id = 0;
//   while (contacts.hasOwnProperty(id)) {
//     id++;
//   }
//   console.log("this is missing id", id);
//   return id;
// }

/**
 * Saves a contact to Firebase.
 * Author: Elias
 * @param {string} baseUrl - The base URL of the Firebase database.
 * @param {string} userId - The user ID under which the contact is saved.
 * @param {number} contactId - The ID of the new contact.
 * @param {Object} contactData - The contact data to save.
 * @returns {Promise<Response>} - The response from the fetch request.
 */
async function saveContactToFirebase(baseUrl, userId, contactId, contactData) {
  return await fetch(`${baseUrl}users/${userId}/contacts/${contactId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}

/**
 * Finds the first missing ID for a new contact.
 * Author: Elias
 * @param {string} userId - The user ID under which the contacts are stored.
 * @returns {Promise<number>} - The first missing ID.
 */
async function findFirstMissingId(userId) {
  const contacts = await loadData(`users/${userId}/contacts`);
  if (contacts === null) {
    console.error("Es wurden keine Kontakte gefunden.");
    return 0;
  }
  const ids = getContactIds(contacts);
  ids.sort((a, b) => a - b);

  if (ids.length == 0) {
    return contacts.length;
  }
  let minId = Math.min(...ids);
  return minId;
}

/**
 * Retrieves contact IDs from an array of contacts.
 * Author: Elias
 * @param {Array<Object>} contacts - The array of contacts.
 * @returns {Array<number>} - The array of contact IDs.
 */
function getContactIds(contacts) {
  return contacts.map((value, index) => (value === null ? index : -1)).filter((index) => index !== -1);
}

/**
 * Finds the first missing ID in an array of IDs.
 * Author: Elias
 * @param {Array<number>} ids - The array of IDs.
 * @returns {number} - The first missing ID.
 */
function findMissingId(ids) {
  let missingId = 0;
  for (const id of ids) {
    if (id !== missingId) {
      break;
    }
    missingId++;
  }
  return missingId;
}

/**
 * Retrieves specific data for a user from the Firebase database based on the user's number in the URL parameter.
 * Author: Elias
 * @param {string} data - The data key to retrieve from Firebase.
 * @returns {Promise<any>} - The requested data.
 */
async function getData(data) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  return fulldata[actualUsersNumber][data];
}

/**
 * Handles the creation of a new contact.
 * Author: Elias
 * @param {Event} event - The event object.
 */
async function createContact(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value;
  const mail = document.getElementById("contactEmail").value;
  const phone = document.getElementById("contactPhone").value;
  let userId = await getUserIdFormUrl();
  let contacts = await getData("contacts");
  let alreadyExist = contacts.find((contact) => contact && contact.mail == mail);
  if (alreadyExist) {
    alert("The contact already exists!");
  } else {
    try {
      const newContact = await saveContact(name, mail, phone, userId);
      clearInputFields();
      updatePageUrl(userId);
      await handleLoadedContacts(userId);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  }
}

/**
 * Updates the page URL with the actualUsersNumber parameter.
 * Author: Elias
 * @param {string} userId - The user ID.
 */
function updatePageUrl(userId) {
  const newUrl = `/contacts.html?msg=welcome&actualUsersNumber=${userId}`;
  history.pushState(null, "", newUrl);
}

/**
 * Handles the display of contacts after a new contact is created.
 * Author: Elias
 * @param {string} userId - The user ID.
 */
async function handleLoadedContacts(userId) {
  const actualUsers = await loadData(`users/${userId}/contacts`);
  if (actualUsers) {
    const sortedContacts = sortContacts(actualUsers);
    displayContacts(sortedContacts);
  } else {
    console.error("No contacts found for the loaded user.");
  }
}

/**
 * Hides the contact information section in a responsive manner.
 * Author: Elias
 */
function closeContactInfoResponsive() {
  document.getElementById("contentright").style.display = "none";
}

/**
 * Opens the edit and delete section in a responsive manner.
 *
 * @author Robin
 */

function openEditAndDeleteResponsive() {
  document.body.style.overflow = "hidden";
  document.getElementById("editDelete-div").classList.remove("editDelete-div-closed-responsive");
  document.getElementById("editDelete-div").style.display = "flex";
}

/**
 * Closes the edit and delete section in a responsive manner.
 *
 * @author Robin
 */
function closeEditAndDeleteResponsive() {
  const editDeleteDiv = document.getElementById("editDelete-div");
  if (window.innerWidth <= 1100) {
    document.getElementById("editDelete-div").classList.add("editDelete-div-closed-responsive");
    setTimeout(function () {
      editDeleteDiv.style.display = "none";
    }, 650);
  }
}
