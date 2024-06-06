/**
 * Initializes contact click events after the DOM is fully loaded.
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", setupContactClickEvents);

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
 * Author: Elias
 */
async function setupContactClickEvents() {
    const contactCards = document.querySelectorAll(".contactCard");
    contactCards.forEach((card) => {
        card.onclick = () => {
            handleCardClick(card);
            dataId = card.getAttribute("data-id");
        };
    });
}

/**
 * Sets up edit and delete buttons.
 * Author: Elias
 */
function setupEditAndDeleteButtons(contactDetailsDiv, card, name, email, phone, randomColor, initials, contentRight) {
    let contactDetails = contactDetailsDiv.querySelectorAll(".edit-div");
    contactDetails.forEach((contactDetail) => {
        contactDetail.onclick = () => openEditContactOverlay(name, email, phone, randomColor, initials);
    });

    contactDetailsDiv.querySelector(".delete-div").onclick = async () => {
        try {
            card.remove();
            await deleteContactFromFirebase(email); 
            removeEmptyLetterHeaders();
            contactDetailsDiv.innerHTML = "";
            if (window.innerWidth < 1100) contentRight.style.display = "none";
        } catch (error) {
            console.error("Fehler beim Löschen des Kontakts:", error);
        }
    };
}

/**
* Sets up the delete button event listener.
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