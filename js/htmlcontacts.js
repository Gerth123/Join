/**
 * This variable stores the last clicked card.
 */
let lastClickedCard = null;

/**
 * Handles the click event for a contact card.
 * @param {HTMLElement} card - The clicked contact card element.
 * @param {Array<Object>} contacts - The contacts array.
 * Author: Elias
 */
function handleCardClick(card, contacts) {
  resetLastClickedCard();
  updateCardStyle(card);
  lastClickedCard = card;
  const { contentRight, name, email, phone, initials } = getCardDetails(card);
  updateContactDetails(contentRight, name, email, phone, initials, contacts);
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
  if (window.matchMedia("(min-width: 1100px)").matches) {
      card.style.backgroundColor = "#2A3647";
      card.querySelector(".NameContact").style.color = "white";
  }
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
 * Updates the contact details in the UI.
 * @param {HTMLElement} contentRight - The content right section element.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The initials of the contact's name.
 * @param {Array<Object>} contacts - The contacts array.
 */
function updateContactDetails(contentRight, name, email, phone, initials, contacts) {
  findContactsRandomColor(email, contacts).then((actualRandomColor) => {
    const contactDetailsDiv = document.querySelector(".contactdetails-right");
    contactDetailsDiv.innerHTML = generateContactDetailsHTML(name, email, phone, actualRandomColor, initials);
    if (window.innerWidth < 1100) contentRight.style.display = "flex";
    setupEditAndDeleteButtons(contactDetailsDiv, lastClickedCard, name, email, phone, actualRandomColor, initials, contentRight, contacts);
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
 * @param {Object} actualUsers - The actual users object.
 * @returns {string} - The user ID associated with the email address.
 * Author: Elias
 */
async function findContactIdByEmail(email, actualUsers) {
  try {
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
 * @param {Array<Object>} contacts - The contacts array.
 * @returns {string} - The HTML string for the contact.
 *
 * Author: Elias
 */
async function generateContactHTML(contact, contacts) {
  const randomColor = await findContactsRandomColor(contact.mail, contacts);
  const initials = await getInitials(contact.name);
  let userId = await findContactIdByEmail(contact.mail, contacts);
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
 * Deletes a contact from Firebase.
 *
 * @param {string} contactId - The ID of the contact to delete.
 * @param {Array<Object>} contacts - The contacts array.
 * 
 * Author: Elias
 */
async function deleteContactFromFirebase(email, contacts) {
  let userId = await getUserIdFormUrl();
  newContactId = await findContactIdByEmail(email, contacts);
  await deleteData(`users/` + userId + `/contacts/` + newContactId);
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
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} randomColor - The contact's random color.
 * @param {string} initials - The contact's initials.
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
 * @param {string} randomColor - The contact's random color.
 * @param {string} initials - The contact's initials.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * Author: Elias
 */
function createOverlayHTML(randomColor, initials, name, email, phone) {
  const overlayHTML = editContactHTML(randomColor, initials, name, email, phone);
  document.body.insertAdjacentHTML("beforeend", overlayHTML);
}

/**
 * Handles contact deletion.
 * @param {string} email - The contact's email.
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
 * @param {string} email - The contact's email.
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
 * @param {string} event - The event object.
 * Author: Elias
 */
async function updateContact(event) {
  event.preventDefault();
  let name = document.getElementById("contactName" + globalEmail).value;
  let newEmail = document.getElementById("contactEmail" + globalEmail).value;
  let phone = document.getElementById("contactPhone" + globalEmail).value;
  let userId = getUserIdFormUrl();
  let initials = getInitials(name);
  let contacts = await getData("contacts");
  let contactId = await findContactIdByEmail(globalEmail, contacts);
  let randomColor = await findContactsRandomColor(globalEmail, contacts);
  await controlAndUpdateTheDates(userId, contactId, name, newEmail, phone, initials, randomColor, contacts);
}

/**
 * This function controls and updates the dates.
 * 
 * @param {string} userId - The user ID.
 * @param {string} contactId - The contact ID.
 * @param {string} name - The name of the contact.
 * @param {string} newEmail - The new email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} randomColor - The random color of the contact.
 * @param {Array<Object>} contacts - The contacts array.
 * 
 * @author Elias
 */
async function controlAndUpdateTheDates(userId, contactId, name, newEmail, phone, initials, randomColor, contacts) {
  try {
    let updatedContact = await createUpdatedContact(name, newEmail, phone, randomColor);
    const contentRight = document.getElementById("contentright");
    await updateContactInFirebase(contactId, updatedContact, userId);
    await refreshAndDisplayContacts(userId);
    const contactDetailsDiv = document.querySelector(".contactdetails-right");
    contactDetailsDiv.innerHTML = generateContactDetailsHTML(name, newEmail, phone, randomColor, initials);
    let card = document.querySelector(`.contactCard[data-id="${dataId}"]`);
    setupEditAndDeleteButtons(contactDetailsDiv, card, name, newEmail, phone, randomColor, initials, contentRight, contacts);
    closeEditContact();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
  }
}