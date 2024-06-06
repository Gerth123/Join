let lastClickedCard = null;

/**
 * Handles the click event for a contact card.
 * @param {HTMLElement} card - The clicked contact card element.
 * Author: Elias
 */
function handleCardClick(card) {
  resetLastClickedCard();
  updateCardStyle(card);
  lastClickedCard = card;
  const { contentRight, name, email, phone, initials } = getCardDetails(card);
  updateContactDetails(contentRight, name, email, phone, initials);
}

/**
 * Resets the style of the last clicked card.
 */
function resetLastClickedCard() {
  if (lastClickedCard) {
    lastClickedCard.style.backgroundColor = "";
    lastClickedCard.querySelector(".NameContact").style.color = "";
  }
}

/**
 * Updates the style of the clicked card.
 * @param {HTMLElement} card - The clicked contact card element.
 */
function updateCardStyle(card) {
  card.style.backgroundColor = "#2A3647";
  card.querySelector(".NameContact").style.color = "white";
}

/**
 * Retrieves details of the clicked card.
 * @param {HTMLElement} card - The clicked contact card element.
 * @returns {Object} - Object containing card details.
 */
function getCardDetails(card) {
  const contentRight = document.getElementById("contentright");
  const name = card.querySelector(".NameContact").textContent;
  const email = card.querySelector(".EmailContact").textContent;
  const phone = card.getAttribute("data-phone");
  const initials = getInitials(name);
  return { contentRight, name, email, phone, initials };
}

/**

 * This function finds the random color of a contact.
 * @param {string} email - The email of the contact.
 * @returns {string} - The random color of the contact.
 * 
 * @author: Robin
 */
async function findContactsRandomColor(email) {
  let actualContact = await findContactIdByEmail(email);
  let urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("actualUsersNumber");
  let actualRandomColor = await loadData(`users/` + userId + `/contacts/` + actualContact + `/color`);
  return actualRandomColor;

 * Updates the contact details in the UI.
 * @param {HTMLElement} contentRight - The content right section element.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The initials of the contact's name.
 */
function updateContactDetails(contentRight, name, email, phone, initials) {
  findContactsRandomColor(email).then((actualRandomColor) => {
    const contactDetailsDiv = document.querySelector(".contactdetails-right");
    contactDetailsDiv.innerHTML = generateContactDetailsHTML(name, email, phone, actualRandomColor, initials);
    if (window.innerWidth < 1100) contentRight.style.display = "flex";
    setupEditAndDeleteButtons(contactDetailsDiv, lastClickedCard, name, email, phone, actualRandomColor, initials, contentRight);
  });

}

/**
 * Generates HTML for displaying contact details.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} randomColor - The random color for the contact's profile picture.
 * @param {string} initials - The initials of the contact's name.
 * @returns {string} - The HTML string for displaying contact details.
 * Author: Elias
 */
function generateContactDetailsHTML(name, email, phone, randomColor, initials) {
  return `
        <div class="profil-user">
            <div class="profil-user-left">
                <div class="profilePicture largeProfilePicture" style="background-color: ${randomColor};">${initials}</div>
            </div>
            <div class="profil-user-right">
                <p class="contact-name">${name}</p>
                <div class="editDelete-div" id="editDelete-div">
                    <div class="edit-div" data-id="1">
                        <img class="contact-img1" src="assets/img/edit.svg"/>
                        <img class="contact-img2" src="assets/img/edit (1).svg"/>
                        <span>Edit</span>
                    </div>
                    <div class="delete-div" data-id="${email}">
                        <img class="contact-img1" src="assets/img/delete.svg"/>
                        <img class="contact-img2" src="assets/img/delete (1).svg"/>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="div-h2">
            <h2 class="h2Contactinfo">Contact Information</h2>
        </div>
        <div class="div-P">
            <p class="contact-mail">Email</p>
            <p class="contact-email">${email}</p>
        </div>
        <div class="Phone-div">
            <p class="contact-Phone">Phone</p>
            <p class="contact-Phone1">${phone}</p>
        </div>
    `;
}

/**
 * Finds the user ID based on the email address.
 * @param {string} email - The email address to search for.
 * @returns {string} - The user ID associated with the email address.
 * Author: Elias
 */
async function findContactIdByEmail(email) {
  try {
    let userId = await getUserIdFormUrl();
    let actualUsers = await loadData("users/" + userId + "/contacts");
    for (let userId in actualUsers) {
      if (actualUsers[userId] === null) {
        continue;
      }
      if (actualUsers[userId].mail === email) {
        return userId;
      }
    }
    throw new Error("Kein Benutzer gefunden für E-Mail: " + email);
  } catch (error) {
    throw error;
  }
}

/**
 * Generates HTML for a contact.
 *
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the contact.
 *
 * Author: Elias
 */
async function generateContactHTML(contact) {
  const randomColor = await findContactsRandomColor(contact.mail);
  const initials = await getInitials(contact.name);
  let userId = await findContactIdByEmail(contact.mail);
  return `
        <div class="contact contactCard" data-id="${userId}" data-phone="${contact.phone}">
            <div class="profilePicture" style="background-color: ${randomColor};">${initials}</div>
            <div class="name-mailDiv">
                <div class="NameContact">${contact.name}</div>
                <div class="EmailContact">${contact.mail}</div>
            </div>
        </div>
    `;
}

/**
 * Generates initials from a name string.
 *
 * @param {string} name - The full name from which initials are generated.
 * @returns {string} - The initials extracted from the name.
 *
 * Author: Elias
 */
function getInitials(name) {
  const words = name.split(" ");
  const initials = words
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  return initials;
}

/**
 * Deletes a contact from Firebase and updates the UI.
 *
 * @param {string} contactId - The ID of the contact to delete.
 *
 * Author: Elias
 */
async function deleteContact(contactId) {
  try {
    removeContactFromUI(contactId);
    await deleteContactFromFirebase(contactId);
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

/**
 * Deletes a contact from Firebase.
 *
 * @param {string} contactId - The ID of the contact to delete.
 * @returns {Promise<void>}
 *
 * Author: Elias
 */
async function deleteContactFromFirebase(email) {
  let userId = await getUserIdFormUrl();
  newContactId = await findContactIdByEmail(email);
  await deleteData(`users/` + userId + `/contacts/` + newContactId);
}

/**
 * Removes the contact element from the UI.
 *
 * @param {string} contactId - The ID of the contact to remove from the UI.
 *
 * Author: Elias
 */
function removeContactFromUI(contactId) {
  const contactCard = document.querySelector(`.contactCard[data-id="${contactId}"]`);
  if (contactCard) {
    contactCard.remove();
    removeEmptyLetterHeaders();
  }
}

/**
 * Removes empty letter headers from the contacts container.
 * 
 * @author Robin
 */
function removeEmptyLetterHeaders() {
  let container = getContactsContainer();
  let separatorContainers = Array.from(container.querySelectorAll('.seperator-contacts-list'));
  separatorContainers.forEach(separator => {
    let hasContacts = false;
    let nextSibling = separator.nextElementSibling;
    while (nextSibling && !nextSibling.classList.contains('contacts-list-letter-container')) {
      if (nextSibling.classList.contains('contact')) {
        hasContacts = true;
        break;
      }
      nextSibling = nextSibling.nextElementSibling;
    }
    checkContactsContainer(separator, hasContacts, container);
  });
}

/**
 * This function checks if there are contacts left in the container. If not, it removes the letter header.
 * 
 * @param {HTMLElement} separator - The separator element
 * @param {boolean} hasContacts - Whether there are contacts in the container
 * @param {HTMLElement} container - The container element
 * 
 * @author Robin
 */

function checkContactsContainer(separator, hasContacts, container) {
  if (!hasContacts) {
    let letterContainer = separator.previousElementSibling;
    if (letterContainer && letterContainer.classList.contains('contacts-list-letter-container')) {
      container.removeChild(letterContainer);
    }
    container.removeChild(separator);
  }
}

/**
 * Holds the email of the contact that is currently being edited.
 *
 * @author Robin
 */
let globalEmail;

/**
 * Generates the HTML for the edit contact overlay.
 *
 * @param {string} randomColor - The random color for the contact's profile picture.
 * @param {string} initials - The initials of the contact's name.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone.
 * @returns {string} The HTML string for the edit contact overlay.
 */
function editContactHTML(randomColor, initials, name, email, phone) {
  globalEmail = email;
  return `
        <div class="overlayForEdit" id="editOverlay">
            <div class="mainSectionOverlay2">  
                <div class="overlay-content">
                    <div class="contentleft">
                        <div class="contentleft2">
                            <img class="logoAddContact" src="assets/img/Capa 2.svg" />
                            <div class="overlayText">
                                <p class="P1overlay">Edit contact</p>
                                <div class="divider-vertical2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="overlay-contentright2">
                        <div class="profilePictureEditResponsive">
                            <div class="profilePicture largeProfilePicture" style="background-color: ${randomColor};">${initials}</div>
                        </div>
                        <form class="inputSection" id="contactForm${email}" onsubmit="updateContact(event)">
                            <div class="imgCloseOverlay2Container">
                                <img class="imgcloseOverlay2" src="assets/img/Close.svg" onclick="closeEditContact()" />
                            </div>
                            <div class="input-divs">
                                <input required id="contactName${email}" value="${name}" placeholder="Name" minlength="5" maxlength="20"/>
                                <img src="assets/img/person.svg" class="imgsinput0-1">
                            </div>
                            <div class="input-divs">
                                <input required id="contactEmail${email}" value="${email}" placeholder="Email" pattern=".*@.*\..*" type="email" maxlength="25" title="An @ is required" />
                                <img src="assets/img/mail.svg" class="imgsinput1-2">
                            </div>
                            <div class="input-divs">
                                <input required id="contactPhone${email}" value="${phone}" placeholder="Phone" maxlength="15" type="text"/>
                                <img src="assets/img/call.svg" class="imgsinput2-3">
                            </div>
                            <div class="overlayButtons">
                                <div class="clearButton1-2 deleteButton">
                                    Delete
                                </div>
                                <button type="submit" class="createButton2">
                                    Save
                                    <img class="imgcheck" src="assets/img/check.svg">
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Opens the edit contact overlay.
 * Author: Elias
 */
function openEditContactOverlay(name, email, phone, randomColor, initials) {
  removeExistingOverlay();
  createOverlayHTML(randomColor, initials, name, email, phone);
  setupDeleteButton(email);
}

/**
 * Removes existing overlay if present.
 * Author: Elias
 */
function removeExistingOverlay() {
  const existingOverlay = document.querySelector("#editOverlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
}

/**
 * Creates and inserts the overlay HTML.
 * Author: Elias
 */
function createOverlayHTML(randomColor, initials, name, email, phone) {
  const overlayHTML = editContactHTML(randomColor, initials, name, email, phone);
  document.body.insertAdjacentHTML("beforeend", overlayHTML);
}

/**
 * Handles contact deletion.
 * Author: Elias
 */
async function handleDeleteContact(email) {
  try {
    await removeContactCard(email);
    await deleteContactFromFirebase(email);
    closeEditContact();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

/**
 * Removes contact card from the DOM.
 * Author: Elias
 */
function removeContactCard(email) {
  const contactCard = document.querySelector(`.contactCard[data-id="${email}"]`);
  if (contactCard) {
    contactCard.remove();
    removeEmptyLetterHeaders();
  }
}

/**
 * Closes the edit contact overlay.
 * Author: Elias
 */
function closeEditContact() {
  const overlay = document.getElementById("editOverlay");
  const mainSectionOverlay2 = document.querySelector(".mainSectionOverlay2");
  if (overlay) {
    mainSectionOverlay2.classList.add("overlay-closed2");
  }
  setTimeout(function () {
    mainSectionOverlay2.classList.remove("overlay-closed2");
    mainSectionOverlay2.classList.remove("overlay-closed-responsive");
    overlay.classList.add("d-none");
  }, 850);
}

/**
 * Updates a contact with new information.
 * Author: Elias
 */
async function updateContact(event) {
  event.preventDefault();
  let name = getInputValue("contactName" + globalEmail);
  let newEmail = getInputValue("contactEmail" + globalEmail);
  let phone = getInputValue("contactPhone" + globalEmail);
  let contactId = await findContactIdByEmail(globalEmail);
  let userId = getUserIdFormUrl();
  let initials = getInitials(name);
  let randomColor = await findContactsRandomColor(globalEmail);

  try {
    let updatedContact = await createUpdatedContact(userId, contactId, name, newEmail, phone);
    const contentRight = document.getElementById("contentright");
    await updateContactInFirebase(contactId, updatedContact, userId);
    await refreshAndDisplayContacts(userId);
    const contactDetailsDiv = document.querySelector(".contactdetails-right");
    contactDetailsDiv.innerHTML = generateContactDetailsHTML(name, newEmail, phone, randomColor, initials);
    let card = document.querySelector(`.contactCard[data-id="${dataId}"]`);
    setupEditAndDeleteButtons(contactDetailsDiv, card, name, newEmail, phone, randomColor, initials, contentRight);
    closeEditContact();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
  }
}

/**
 * Retrieves the input value by ID.
 * Author: Elias
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Creates an updated contact object.
 * Author: Elias
 */
async function createUpdatedContact(userId, contactId, name, newEmail, phone) {
  return {
    mail: newEmail,
    name: name,
    phone: phone,
    color: await loadData(`users/${userId}/contacts/${contactId}/color`),
  };
}

/**
 * Refreshes and displays sorted contacts.
 * Author: Elias
 */
async function refreshAndDisplayContacts(userId) {
  const actualUsers = await loadData(`users/${userId}/contacts`);
  const sortedContacts = await sortContacts(actualUsers);
  await displayContacts(sortedContacts);
}

/**
 * Initializes event listeners for contact cards.
 * Author: Elias
 */
function initContactCardClickHandlers() {
  const contactCards = document.querySelectorAll('.contactCard');
  contactCards.forEach(card => {
    card.addEventListener('click', () => handleCardClick(card));
  });
}

initContactCardClickHandlers();

async function renderContacts() {
  const contactsContainer = document.getElementById('contacts-container');
  if (contactsContainer) {
    contactsContainer.innerHTML = ''; 
    const contacts = await fetchContacts();
    for (const contact of contacts) {
      contactsContainer.innerHTML += await generateContactHTML(contact); 
    }
    initContactCardClickHandlers();
  } else {
    console.error('Element with id "contacts-container" not found.');
  }
}

/**
 * Finds or generates a random color for a contact based on the email.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<string>} - A promise that resolves to a random color in hexadecimal format.
 * Author: Elias
 */
async function findContactsRandomColor(email) {
  let userId = await getUserIdFormUrl();
  let actualUsers = await loadData(`users/${userId}/contacts`);
  for (let contactId in actualUsers) {
    if (actualUsers[contactId].mail === email) {
      return actualUsers[contactId].color;
    }
  }

  return generateRandomColor();
}

document.addEventListener('DOMContentLoaded', function() {
  const contacts = document.querySelectorAll('.contact');
  contacts.forEach(contact => {
      contact.addEventListener('click', function() {
          this.classList.toggle('clicked');
      });
  });
});