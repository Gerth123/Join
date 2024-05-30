document.addEventListener('DOMContentLoaded', setupContactClickEvents);

async function setupContactClickEvents() {
    const contactCards = document.querySelectorAll('.contactCard');

    contactCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const name = card.querySelector('.NameContact').textContent;
            const email = card.querySelector('.EmailContact').textContent;
            const phone = card.getAttribute('data-phone');
            const randomColor = generateRandomColor(name);
            const initials = getInitials(name);

            const contactDetailsDiv = document.querySelector('.contactdetails-right');
            contactDetailsDiv.innerHTML = generateContactDetailsHTML(name, email, phone, randomColor, initials);

            const editButton = contactDetailsDiv.querySelector('.edit-div');
            editButton.addEventListener('click', function () {
                openEditContactOverlay(name, email, phone, randomColor, initials);
            });

            const deleteButton = contactDetailsDiv.querySelector('.delete-div');
            deleteButton.addEventListener('click', async function () {
                try {
                    await deleteContactFromFirebase(email);
                    card.remove();
                    contactDetailsDiv.innerHTML = '';
                } catch (error) {
                    console.error("Fehler beim Löschen des Kontakts:", error);
                }
            });
        });
    });
}

function generateContactDetailsHTML(name, email, phone, randomColor, initials) {
    return `
        <div class="profil-user">
            <div class="profil-user-left">
                <div class="profilePicture largeProfilePicture" style="background-color: ${randomColor};">${initials}</div>
            </div>
            <div class="profil-user-right">
                <p class="contact-name">${name}</p>
                <div class="editDelete-div">
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

async function findUserIdByEmail(email) {
    try {
        let actualUsers = await loadData('users/-NyKF7omq8KOQgBXWhYW/contacts');
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
    const userId = '-NyQZIrDvTgyGwkges5f';

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
function removeContactFromUI(contactId) {
    const contactCard = document.querySelector(`.contactCard[data-id="${contactId}"]`);
    if (contactCard) {
        contactCard.remove();
    }
}

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
        <div class="overlay" id="editOverlay">
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
                        <form class="inputSection" id="contactForm${email}" onsubmit="updateContact(event)">
                            <div class="input-divs">
                                <input required id="contactName${email}" value="${name}" placeholder="Name"/>
                                <img src="assets/img/person.svg" class="imgsinput0-1">
                            </div>
                            <div class="input-divs">
                                <input required id="contactEmail${email}" value="${email}" placeholder="Email" pattern=".*@.*\..*" type="email" title="An @ is required" />
                                <img src="assets/img/mail.svg" class="imgsinput1-2">
                            </div>
                            <div class="input-divs">
                                <input required id="contactPhone${email}" value="${phone}" placeholder="Phone" type="tel" title="Only numbers allowed" />
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

async function openEditContactOverlay(name, email, phone, randomColor, initials) {
    const overlayHTML = await editContactHTML(randomColor, initials, name, email, phone);
    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    const deleteButton = document.querySelector('.deleteButton');
    deleteButton.addEventListener('click', async function () {
        try {
            await deleteContactFromFirebase(email);
            closeEditContact();
            const contactCard = document.querySelector(`.contactCard[data-id="${email}"]`);
            if (contactCard) {
                contactCard.remove();
            }
        } catch (error) {
            console.error("Fehler beim Löschen des Kontakts:", error);
        }
    });
}

function closeEditContact() {
    const overlay = document.getElementById('editOverlay');
    if (overlay) {
        overlay.remove();
    }
}

async function updateContact(event) {
    event.preventDefault();
    let name = document.getElementById('contactName' + globalEmail).value;
    let newEmail = document.getElementById('contactEmail' + globalEmail).value;
    let phone = document.getElementById('contactPhone' + globalEmail).value;
    console.log(name, newEmail, phone);
    let contactId = await findUserIdByEmail(email);

    try {
        const updatedContact = {
            mail: newEmail,
            name: name,
            phone: phone,
    };

        await updateContactInFirebase(contactId, updatedContact);
        closeEditContact();

        const actualUsers = await loadData(`users/-NyKF7omq8KOQgBXWhYW/contacts`);
        const sortedContacts = await sortContacts(actualUsers);
        await displayContacts(sortedContacts);
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Kontakts:", error);
    }
}

async function updateContactInFirebase(contactId, updatedContact) {
    const baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';
    const userId = '-NyKF7omq8KOQgBXWhYW';

    const url = `${baseUrl}users/${userId}/contacts/${contactId}.json`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    });

    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Kontakts: ' + response.statusText);
    }

    return await response.json();
}