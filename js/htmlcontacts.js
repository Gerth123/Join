/**
 * Listens for DOMContentLoaded, adds click listener to 'contactCard' elements,
 * extracts data from clicked card, and updates '.contactdetails-right' HTML.
 * 
 * Author: Elias
 */
function setupContactClickEvents() {
    const contactCards = document.querySelectorAll('.contactCard');

    contactCards.forEach(function(card) {
        card.addEventListener('click', function() {
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
                            <div class="edit-div">
                                <img class="contact-img1" src="assets/img/edit.svg"/>
                                <img class="contact-img2" src="assets/img/edit (1).svg"/>
                                <span>Edit</span>
                            </div>
                            <div class="delete-div">
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
        });
    });
}

/**
 * Generates HTML for a contact.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the contact.
 * 
 * Author: Elias
 */
function generateContactHTML(contact) {
    const randomColor = generateRandomColor(contact.name);
    const initials = getInitials(contact.name);
    return `
        <div class="contact contactCard" data-phone="${contact.phone}">
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