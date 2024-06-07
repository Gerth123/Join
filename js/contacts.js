/**
 * Clears input fields in the contact form.
 * Author: Elias
 */
function clearInputFields() {
  document.querySelectorAll(".inputField").forEach((input) => (input.value = ""));
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
    if (a === null) return 1;
    if (b === null) return -1;
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
  console.log("given contacts", contacts);
  const contactsContainer = getContactsContainer();
  if (!contactsContainer) return;
  if (!contacts || contacts.length === 0) {
    console.error("Keine Kontakte gefunden.");
    return;
  }
  // console.log(contactsContainer);
  clearContactsContainer(contactsContainer);
  console.log("populate contacts", contacts);
  await populateContacts(contacts, contactsContainer);
  setupContactClickEvents();
}

async function addContactToDOM(contact, contactsAdded) {
  // const contactsNew = [...contactsAdded, contact];
  // contacts = contactsNew;
  // console.log("this is contactsNew", contactsNew);
  console.log("contact", contact);
  console.log("contactsAdded", contactsAdded);
  console.log("contacts", contacts);
  sortContacts(contacts);
  console.log(contactsNew);
  displayContacts(contacts);
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
      console.log("contact", contact);
      const contactLetter = contact.name.charAt(0).toUpperCase();
      if (contactLetter !== currentLetter) {
        currentLetter = contactLetter;
        addLetterHeader(container, currentLetter);
      }
      const contactHTML = await generateContactHTML(contact);
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

// Dummy generateContactHTML function for demonstration purposes
// async function generateContactHTML(contact) {
//   return `
//     <div class="contact">
//       <h2>${contact.name}</h2>
//       <p>Phone: ${contact.phone}</p>
//       <p>Email: ${contact.email}</p>
//     </div>
//   `;
// }

/**
 * Saves a contact in Firebase under a sequential ID and adds a randomly generated color.
 * Author: Elias
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} userId - The user ID under which the contact is saved.
 */
async function saveContact(name, mail, phone, userId) {
  const contactData = createContactData(name, mail, phone);
  // console.log("this is contactData", contactData);
  const newContactId = await findMissingId(userId);
  // console.log("this is newContactId", newContactId);
  if (contacts.length == newContactId) {
    contacts.push(contactData);
  } else {
    contacts[newContactId] = contactData;
  }
  let path = `users/` + userId + `/contacts/` + newContactId;
  await putData(path, contactData);
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
 * Finds the first missing ID in an array of IDs.
 * Author: Elias
 * @param {string} userId - The user ID.
 * @returns {number} - The first missing ID.
 */
async function findMissingId(userId) {
  // let contacts = await loadData(`users/${userId}/contacts`);
  let missingId = 0;
  for (contact of contacts) {
    if (contact === null) {
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
  // contacts = await getData("contacts");
  let alreadyExist = contacts.find((contact) => contact && contact.mail == mail);
  await checkIfContactAlreadyExists(alreadyExist, userId, phone, name, mail, contacts);
}

/**
 * This function checks if a contact already exists.
 *
 * @param {boolean} alreadyExist - If the contact already exists.
 * @param {string} userId - The user ID.
 * @param {string} phone - The phone number of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} mail - The email of the contact.
 *
 * @author Robin
 */
async function checkIfContactAlreadyExists(alreadyExist, userId, phone, name, mail, contacts) {
  if (alreadyExist) {
    alert("The contact already exists!");
  } else {
    try {
      await saveContact(name, mail, phone, userId);
      clearInputFields();
      closeAddContact();
      addContactToDOM({ name, mail, phone }, contacts);
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

// /**
//  * Handles the display of contacts after a new contact is created.
//  * Author: Elias
//  * @param {string} userId - The user ID.
//  */
// async function handleLoadedContacts(userId) {
//   const actualUsers = await loadData(`users/${userId}/contacts`);
//   if (actualUsers) {
//     const sortedContacts = sortContacts(actualUsers);
//     displayContacts(sortedContacts);
//   } else {
//     console.error("No contacts found for the loaded user.");
//   }
// }

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
 *
 * Author: Elias
 */
async function updateContactInFirebase(contactId, updatedContact, userId) {
  // console.log("this is updatedContact", updatedContact);
  // console.log("this is contactId", contactId);
  await putData(`users/` + userId + `/contacts/` + contactId, updatedContact);
}
