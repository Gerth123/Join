/**
 * Clears input fields in the contact form.
 * Author: Elias
 */
function clearInputFields() {
  document.querySelectorAll(".inputField").forEach((input) => (input.value = ""));
}

/**
 * Clears input fields in the add contact form.
 * 
 * @author Robin
 */
function clearInputFieldsAddContact() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
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
  contacts = Object.values(contacts);
  contacts.sort((a, b) => {
    if (a === null || a.name === undefined) return 1;
    if (b === null || b.name === undefined) return -1;
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
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
  setupContactClickEvents(contacts);
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
      const contactHTML = await generateContactHTML(contact, contacts);
      container.innerHTML += contactHTML;
    }
  }
  removeEmptyLetterHeaders();
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
  const letterContainer = document.createElement("div");
  const letterDiv = document.createElement("h2");
  letterContainer.classList.add("contacts-list-letter-container");
  letterDiv.classList.add("contacts-list-letter");
  letterDiv.textContent = letter;
  letterContainer.appendChild(letterDiv);
  return letterContainer;
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
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} userId - The user ID under which the contact is saved.
 * @param {Object} contacts - The contacts object.
 */
async function saveContact(name, email, phone, userId, contacts) {
  const contactData = await createContactData(name, email, phone);
  // const newContactId = await findMissingId(contacts);
  let path = 'api/users/all-contacts/';
  await putDataBackend(path, contactData);
  return contactData;
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
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {Object} - The contact data object.
 */
function createContactData(name, email, phone) {
  return {
    color: generateRandomColor(), 
    email,
    name,
    phone,    
  };
}

/**
 * Finds the first missing ID in an array of IDs.
 * Author: Elias
 * @param {Object} contacts - The contacts object.
 * @returns {number} - The first missing ID.
 */
async function findMissingId(contacts) {
  contacts = Object.values(contacts);
  let missingId = 0;
  for (contact of contacts) {
    if (contact === null) {
      break
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
  const email = document.getElementById("contactEmail").value;
  const phone = document.getElementById("contactPhone").value;
  let userId = await getUserIdFormUrl();
  let contacts = await loadDataBackend("api/users/all-contacts/");
  let alreadyExist = contacts.find((contact) => contact && contact.email == email);
  await checkIfContactAlreadyExists(alreadyExist, userId, phone, name, email, contacts);
}

/**
 * This function checks if a contact already exists.
 * 
 * @param {boolean} alreadyExist - If the contact already exists.
 * @param {string} userId - The user ID.
 * @param {string} phone - The phone number of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {Object} contacts - The contacts object.
 * 
 * @author Robin 
 */
async function checkIfContactAlreadyExists(alreadyExist, userId, phone, name, email, contacts) {
  if (alreadyExist) {
    alert("The contact already exists!");
  } else {
    try {
      let contactData = await saveContact(name, email, phone, userId, contacts);
      clearInputFields();
      closeAddContact();
      let contactId = await findMissingId(contacts);
      let allContacts = { ...contacts, [contactId]: contactData,};
      addContactToDOM({ name, email, phone, color: contactData.color }, allContacts, contactId);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  }
}

/**
 * This function closes the add contact overlay.
 * 
 * @author Robin
 */
function closeAddContact() {
  const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
  mainSectionOverlay.classList.add("overlay-closed");
  setTimeout(function () {
    overlay.style.display = "none";
  }, 850);
}

/**
 * Handles the display of contacts after a new contact is created.
 * Author: Elias
 * @param {Array<Object>} contactsNew - The new contacts array.
 */
async function handleLoadedContacts(contactsNew) {
  if (contactsNew) {
    const sortedContacts = sortContacts(contactsNew);
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

/**
 * Updates a contact's information in Firebase.
 *
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContact - The updated contact object containing name, email, and phone.
 * @param {string} userId - The ID of the user who owns the contact.
 *
 * Author: Elias
 */
async function updateContactInFirebase(contactId, updatedContact, userId) {
  await putData(`users/` + userId + `/contacts/` + contactId, updatedContact);
}

/**
 * Creates an updated contact object.
 * @param {string} name - The name of the contact.
 * @param {string} newEmail - The new email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} randomColor - The random color of the contact.
 * Author: Elias
 */
async function createUpdatedContact(name, newEmail, phone, randomColor) {
  return {
    email: newEmail,
    name: name,
    phone: phone,
    color: randomColor,
  };
}

/**
 * Refreshes and displays sorted contacts.
 * @param {string} userId - The ID of the user who owns the contacts.
 * Author: Elias
 */
async function refreshAndDisplayContacts(userId) {
  const actualUsers = await loadData(`users/${userId}/contacts`);
  const sortedContacts = await sortContacts(actualUsers);
  await displayContacts(sortedContacts);
}

/**
 * Finds or generates a random color for a contact based on the email.
 * @param {string} email - The email address of the contact.
 * @param {Object} contacts - The contacts object.
 * @returns {Promise<string>} - A promise that resolves to a random color in hexadecimal format.
 * Author: Elias
 */
// async function findContactsRandomColor(email, contacts) {
//   for (let contactId in contacts) {
//     if (contacts[contactId] === null) {
//       continue;
//     }
//     if (contacts[contactId].email === email) {
//       return contacts[contactId].color;
//     }
//   }
//   return generateRandomColor();
// }