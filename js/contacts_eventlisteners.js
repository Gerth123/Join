/**
 * Initializes contact click events after the DOM is fully loaded.
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", setupContactClickEvents(getData("contacts")));

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

    addContactButton.onclick = function (event) {
        event.stopPropagation();
        overlay.style.display = "flex";
        mainSectionOverlay.classList.remove("overlay-closed");
    };
}

/**
* Sets up the event listener for clicks on the document.
* Author: Elias
*/
function setupDocumentClickListener() {
    const overlay = document.getElementById("overlay");
    const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
    document.onclick = function (event) {
        if (overlay.style.display === "flex" && !mainSectionOverlay.contains(event.target)) {
            overlay.style.display = "none";
        }
    };
}

/**
 * Sets up the event listener for the close image.
 * Author: Elias
 */
function setupCloseImageListener() {
    const closeImage = document.querySelector(".imgcloseOverlay");
    const overlay = document.getElementById("overlay");
    const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
    closeImage.onclick = function (event) {
        event.stopPropagation();
        mainSectionOverlay.classList.add("overlay-closed");
        clearInputFieldsAddContact();
        setTimeout(function () {
            overlay.style.display = "none";
        }, 850);
    };
}

/**
* Sets up the event listener for the cancel button.
* Author: Elias
*/
function setupCancelButtonListener() {
    const cancelButton = document.querySelector(".clearButton");
    const overlay = document.getElementById("overlay");
    const mainSectionOverlay = document.querySelector(".mainSectionOverlay");
    cancelButton.onclick = function (event) {
        event.stopPropagation();
        mainSectionOverlay.classList.add("overlay-closed");
        setTimeout(function () {
            overlay.style.display = "none";
        }, 850);
        clearInputFields();
    };
}

/**
 * Sets up the event listener for the contactsA div.
 * Author: Elias
 */
function setupContactsAListener() {
    const contactsADiv = document.querySelector(".contactsA");
    if (contactsADiv) {
        contactsADiv.onclick = () => {
            contactsADiv.classList.toggle("active");
        };
    }
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


let dataId;

/**
 * Initializes contact click events.
 * @param {Array<Object>} contacts - The contacts to be displayed.
 * Author: Elias
 */
async function setupContactClickEvents(contacts) {
    const contactCards = document.querySelectorAll(".contactCard");
    contactCards.forEach((card) => {
        card.onclick = () => {
            handleCardClick(card, contacts);
            dataId = card.getAttribute("data-id");
        };
    });
}

/**
 * Sets up edit and delete buttons.
 * 
 * @param {HTMLElement} card - The contact card element.
 * @param {Object} contactDetailsDiv - The contact details div element.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} randomColor - The random color of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {HTMLElement} contentRight - The content right section element.
 * @param {Array<Object>} contacts - The contacts array.
 * 
 * Author: Elias
 */
function setupEditAndDeleteButtons(contactDetailsDiv, card, name, email, phone, randomColor, initials, contentRight) {
    
    let contactDetails = contactDetailsDiv.querySelectorAll(".edit-div");
    contactDetails.forEach((contactDetail) => {
        contactDetail.onclick = () => openEditContactOverlay(name, email, phone, randomColor, initials);
    });
    contactDetailsDiv.querySelector(".delete-div").onclick = async () => {
        let contacts = await getData("contacts");
        await deleteContactOnclick(card, email, contentRight, contactDetailsDiv, contacts);
    };
}

/**
 * This function deletes a contact from the Firebase database.
 * 
 * @param {string} card - The card element.
 * @param {string} email - The email of the contact.
 * @param {string} contentRight - The content right section element.
 * @param {Object} contactDetailsDiv - The contact details div element.
 * @param {Array<Object>} contacts - The contacts array.
 * 
 * @author Elias
 */
async function deleteContactOnclick(card, email, contentRight, contactDetailsDiv, contacts) {
    try {
        card.remove();
        await deleteContactFromFirebase(email, contacts); 
        removeEmptyLetterHeaders();
        contactDetailsDiv.innerHTML = "";
        if (window.innerWidth < 1100) contentRight.style.display = "none";
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}

/**
* Sets up the delete button event listener.
* 
* @param {string} email - The email of the contact. 
*
* Author: Elias
*/
function setupDeleteButton(email) {
    const deleteButton = document.querySelector(".deleteButton");
    deleteButton.onclick = async function () {
        await handleDeleteContact(email);
    };
}

/**
* Sets up the contact click event listener.
* 
* Author: Elias
*/
document.addEventListener('DOMContentLoaded', function() {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        contact.onclick = function() {
            this.classList.toggle('clicked');
        };
    });
  });

  /**
 * Initializes event listeners for contact cards.
 * Author: Elias
 */
async function initContactCardClickHandlers() {
    let contacts = await getData("contacts");
    const contactCards = document.querySelectorAll('.contactCard');
    contactCards.forEach(card => {
      card.onclick = () => handleCardClick(card, contacts);
    });
  }
  
  initContactCardClickHandlers();