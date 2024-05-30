/**
 * Listens for DOMContentLoaded, adds click listener to 'contactCard' elements,
 * extracts data from clicked card, and updates '.contactdetails-right' HTML.
 * 
 * Author: Elias
 */
async function setupContactClickEvents() {
    const contactCards = document.querySelectorAll('.contactCard');

    contactCards.forEach(function (card) {
        card.addEventListener('click', function () {
            let name = card.querySelector('.NameContact').textContent;
            let email = card.querySelector('.EmailContact').textContent;
            let phone = card.getAttribute('data-phone');
            let randomColor = generateRandomColor(name);
            let initials = getInitials(name);

            let contactDetailsDiv = document.querySelector('.contactdetails-right');
            contactDetailsDiv.innerHTML = `
                <div class="profil-user">
                    <div class="profil-user-left">
                        <div class="profilePicture largeProfilePicture" style="background-color: ${randomColor};">${initials}</div>
                    </div>
                    <div class="profil-user-right">
                        <p class="contact-name">${name}</p>
                        <div class="editDelete-div">
                            <div class="edit-div" data-id="1" onclick="openEditContactOverlay()">
                                <img class="contact-img1" src="assets/img/edit.svg"/>
                                <img class="contact-img2" src="assets/img/edit (1).svg"/>
                                <span>Edit</span>
                            </div>
                            <div class="delete-div" data-id="${card.dataset.id}">
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

            const deleteButton = contactDetailsDiv.querySelector('.delete-div');
            deleteButton.addEventListener('click', async function () {
                const contactId = card.dataset.id;

                try {
                    await deleteContactFromFirebase(email);
                    card.remove();
                    await removeContactFromUI(email);
                    contactDetailsDiv.innerHTML = '';
                } catch (error) {
                    console.error("Fehler beim Löschen des Kontakts:", error);
                }
            });
        });
    });
}

async function findUserIdByEmail(email) {
    console.log(email);
    let urlParams = new URLSearchParams(window.location.search);
    let actualUsersNumber = urlParams.get('actualUsersNumber');
    
    try {
        let users = await loadData('users/' + actualUsersNumber + '/contacts');
        for (let userId in users) {
            if (users[userId] === null) {
                continue;
            }
            if (users[userId].mail === email) {
                return userId;
            }
        }
        throw new Error("No matching user found for email: " + email);
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
    const randomColor = await generateRandomColor(contact.name);
    const initials = await getInitials(contact.name);
    let userId = await findUserIdByEmail(contact.mail);
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
 * Generates a random color based on a seed string.
 * 
 * @param {string} seed - The seed string used to generate the color.
 * @returns {string} - A hex color code generated from the seed.
 * 
 * Author: Elias
 */
function generateRandomColor(seed) {
    var hash = 0;
    for (var i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    var color = "#";
    for (var j = 0; j < 3; j++) {
        var value = (hash >> (j * 8)) & 255;
        color += value.toString(16).padStart(2, '0');
    }
    return color;
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
    const words = name.split(' ');
    const initials = words.map(word => word.charAt(0)).join('').toUpperCase();
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
        await deleteContactFromFirebase(contactId);
        removeContactFromUI(contactId);
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
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
    const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';
    const userId = '-NyKF7omq8KOQgBXWhYW';

    const url = `${baseUrl}users/${userId}/contacts.json`;
    const response = await fetch(url);
    const data = await response.json();
    newContactId = await findUserIdByEmail(email);
    await deleteData(`users/` + userId + `/contacts/` + newContactId);
    let actualUsers = await loadData('users/' + userId + '/contacts');
    const sortedContacts = await sortContacts(actualUsers);
    await displayContacts(sortedContacts);
}

/**
 * Removes the contact element from the UI.
 * 
 * @param {string} contactId - The ID of the contact to remove from the UI.
 * 
 * Author: Elias
 */
function removeContactFromUI(email) {
    const contactCard = document.querySelector(`.contactCard[data-id="${email}"]`); 
    if (contactCard && contactList) {
        contactCard.remove();
    }
}

/**
 * Generates the HTML for the edit contact overlay.
 * 
 * @param {string} randomColor - The random color for the contact's profile picture.
 * @param {string} initials - The initials of the contact's name.
 * @returns {string} The HTML string for the edit contact overlay.
 */
function editcontactHTML(randomColor, initials) {
    return `
        <div class="overlay">
            <div class="mainSectionOverlay">  
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
                        <img class="imgcloseOverlay2" src="assets/img/Close.svg" onclick="closeEditContact()" />
                        <div class="profilePicture largeProfilePicture" style="background-color: ${randomColor};">${initials}</div>
                        <form class="inputSection" id="contactForm" onsubmit="updateContact(event)">
                            <div class="input-divs">
                                <input required id="contactName" placeholder="Name"/>
                                <img src="assets/img/person.svg" class="imgsinput0-1">
                            </div>
                            <div class="input-divs">
                                <input required id="contactEmail" placeholder="Email" pattern=".*@.*\..*" type="email" title="An @ is required" />
                                <img src="assets/img/mail.svg" class="imgsinput1-2">
                            </div>
                            <div class="input-divs">
                                <input required id="contactPhone" placeholder="Phone" type="tel" title="Only numbers allowed" />
                                <img src="assets/img/call.svg" class="imgsinput2-3">
                            </div>
                            <div class="overlayButtons">
                                <div class="clearButton1-2">
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
 * Open the edit contact overlay.
 * 
 * @param {string} randomColor - The random color for the contact's profile picture.
 * @param {string} initials - The initials of the contact's name.
 */
function openEditContactOverlay(randomColor, initials) {
    const overlayContainer = document.getElementById('overlay-container');
    const editOverlayHTML = editcontactHTML(randomColor, initials);

    if (overlayContainer.style.display !== 'block' || !overlayContainer.innerHTML.includes(editOverlayHTML)) {
        overlayContainer.innerHTML = editOverlayHTML;
        overlayContainer.style.display = 'block';
    }
}

/**
 * Close the edit contact overlay.
 */
function closeEditContact() {
    const overlayContainer = document.getElementById('overlay-container');
    overlayContainer.style.display = 'none';
}