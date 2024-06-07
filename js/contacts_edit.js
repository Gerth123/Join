/**
 * This function is called when the Add Contact button is clicked.
 * 
 * @param {Object} contact - The contact object containing name, mail, phone, etc.
 * @param {Array} contacts - The list of old contacts.
 * @param {number} contactId - The ID of the contact.
 * 
 * @author Robin
 */
async function addContactToDOM(contact, contacts, contactId) {
    insertContactCard(contact, contacts, contactId);
    clearInputFieldsAddContact();
}

/**
* Inserts a new contact card into the contacts container at the correct position.
*
* @param {Object} contact - The contact object containing name, mail, phone, etc.
* @param {Array} oldContacts - The list of old contacts.
* @param {number} contactId - The ID of the contact.
* @returns {Promise<void>}
* 
* @author Robin
*/
async function insertContactCard(contact, oldContacts, contactId) {
    const container = getContactsContainer();
    const contactHTML = await generateContactHTML(contact, oldContacts);
    const newContactCard = createContactCard(contactHTML);
    const contactsArray = Array.from(container.querySelectorAll('.contact'));
    const contactLetter = contact.name.charAt(0).toUpperCase();
    if (await handleSpecialCase(contact, oldContacts, contactLetter, contactsArray, contactId, container, newContactCard)) return;
    await insertNewContact(container, contactsArray, contact, newContactCard, contactLetter);
    setupContactClickEvents(oldContacts);
    removeEmptyLetterHeaders();
}

/**
 * Creates a contact card element from the contact HTML string.
 * @param {string} contactHTML - The HTML string representing the contact card.
 * @returns {HTMLElement} The created contact card element.
 * 
 * @author Robin
 */
function createContactCard(contactHTML) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contactHTML;
    return tempDiv.firstElementChild;
}

/**
 * Handles the special case for inserting the contact if it starts with the letter 'A'.
 * @param {Object} contact - The contact object.
 * @param {Object} oldContacts - The list of old contacts.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @param {Array} contacts - The list of current contacts.
 * @param {number} contactId - The ID of the contact.
 * @param {HTMLElement} container - The contacts container element.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @returns {Promise<boolean>} True if the special case was handled, otherwise false.
 * 
 * @author Robin
 */
async function handleSpecialCase(contact, oldContacts, contactLetter, contacts, contactId, container, newContactCard) {
    let letterExists = await checkIfLetterExists(contactLetter, contacts);
    for (const existingContact of contacts) {
        const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
        const existingContactLetter = existingContactName.charAt(0);
        if (!letterExists && contactLetter < existingContactLetter) {
            const contactsNew = { ...oldContacts, [contactId]: contact };
            insertLetterSection(contactLetter, container, newContactCard, contactsNew);
            return true;
        }
    }
    return false;
}

/**
 * Inserts a new letter section (letter div and separator) into the contacts container.
 * 
 * @param {string} contactLetter - The first letter of the contact's name.
 * @param {HTMLElement} container - The contacts container element.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {Object} contactsNew - The updated contacts object.
 * 
 * @author Robin
 */
function insertLetterSection(contactLetter, container, newContactCard, contactsNew) {
    let letterDiv = createLetterDiv(contactLetter);
    let separatorDiv = createSeparatorDiv();
    container.insertAdjacentElement('afterbegin', letterDiv);
    letterDiv.insertAdjacentElement('afterend', separatorDiv);
    separatorDiv.insertAdjacentElement('afterend', newContactCard);
    setupContactClickEvents(contactsNew);
}

/**
 * Inserts the new contact card into the container at the correct position.
 * 
 * @param {HTMLElement} container - The contacts container element.
 * @param {Array} contacts - The list of current contacts.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @returns {Promise<void>}
 * 
 * @author Robin
 */
async function insertNewContact(container, contacts, contact, newContactCard, contactLetter) {
    let inserted = false;
    let letterExists = await checkIfLetterExists(contactLetter, contacts);
    for (const existingContact of contacts) {
        if (await handleExistingContacts(container, contact, contacts, newContactCard, existingContact, contactLetter, letterExists)) {
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        await handleRemainingInsertion(container, contacts, newContactCard, contactLetter, letterExists);
    }
}

/**
 * Handles the insertion of the new contact card among existing contacts.
 * 
 * @param {HTMLElement} container - The contacts container element.
 * @param {Object} contact - The contact object.
 * @param {Array} contacts - The list of current contacts.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {HTMLElement} existingContact - The existing contact card element.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @param {boolean} letterExists - Whether the contact letter already exists among contacts.
 * @returns {Promise<boolean>} True if the contact was inserted, otherwise false.
 * 
 * @author Robin
 */
async function handleExistingContacts(container, contact, contacts, newContactCard, existingContact, contactLetter, letterExists) {
    const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
    const existingContactLetter = existingContactName.charAt(0);
    if (letterExists && existingContactLetter === contactLetter) {
        if (contact.name.toUpperCase() < existingContactName) {
            container.insertBefore(newContactCard, existingContact);
            return true;
        }
    } else if (existingContactLetter > contactLetter && !letterExists) {
        await insertBeforeLetter(contacts, newContactCard, contactLetter);
        return true;
    }
    return false;
}

/**
 * Inserts the new contact card before the appropriate letter section.
 * 
 * @param {Array} contacts - The list of current contacts.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @returns {Promise<void>}
 * 
 * @author Robin
 */
async function insertBeforeLetter(contacts, newContactCard, contactLetter) {
    const letterDiv = createLetterDiv(contactLetter);
    const separatorDiv = createSeparatorDiv();
    const reversedContacts = [...contacts].reverse();
    let reversedExistingContact = findReversedExistingContact(reversedContacts, contactLetter);
    if (reversedExistingContact) {
        reversedExistingContact.insertAdjacentElement('afterend', letterDiv);
        letterDiv.insertAdjacentElement('afterend', separatorDiv);
        separatorDiv.insertAdjacentElement('afterend', newContactCard);
    }
}

/**
 * Finds the last contact card in the reversed contacts list with a letter less than the contact letter.
 * 
 * @param {Array} reversedContacts - The reversed list of current contacts.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @returns {HTMLElement|null} The last reversed existing contact element, or null if not found.
 * 
 * @author Robin
 */
function findReversedExistingContact(reversedContacts, contactLetter) {
    for (const reversedContact of reversedContacts) {
        const reversedContactName = reversedContact.querySelector('.NameContact').innerText.toUpperCase();
        if (reversedContactName.charAt(0) < contactLetter) {
            return reversedContact;
        }
    }
    return null;
}

/**
 * Handles the remaining insertion logic if the new contact was not yet inserted.
 * 
 * @param {HTMLElement} container - The contacts container element.
 * @param {Array} contacts - The list of current contacts.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @param {boolean} letterExists - Whether the contact letter already exists among contacts.
 * @returns {Promise<void>}
 * 
 * @author Robin
 */
async function handleRemainingInsertion(container, contacts, newContactCard, contactLetter, letterExists) {
    if (letterExists) {
        let lastLetterContact = findLastLetterContact(contacts, contactLetter);
        if (lastLetterContact) {
            lastLetterContact.insertAdjacentElement('afterend', newContactCard);
        }
    } else {
        let lastExistingContact;
        for (const existingContact of contacts) {
            lastExistingContact = existingContact;
        }
        insertNewLetterSection(newContactCard, contactLetter, lastExistingContact);
    }
}

/**
 * Finds the last contact card in the contacts list with the same letter as the contact letter.
 * 
 * @param {Array} contacts - The list of current contacts.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @returns {HTMLElement|null} The last letter contact element, or null if not found.
 * 
 * @author Robin
 */
function findLastLetterContact(contacts, contactLetter) {
    let lastLetterContact = null;
    for (const existingContact of contacts) {
        const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
        if (existingContactName.charAt(0) === contactLetter) {
            lastLetterContact = existingContact;
        }
    }
    return lastLetterContact;
}

/**
 * Inserts a new letter section (letter div and separator) into the contacts container.
 * 
 * @param {HTMLElement} newContactCard - The new contact card element.
 * @param {string} contactLetter - The first letter of the contact's name.
 * @param {HTMLElement} lastExistingContact - The last existing contact element.
 * 
 * @author Robin
 */
function insertNewLetterSection(newContactCard, contactLetter, lastExistingContact) {
    const letterDiv = createLetterDiv(contactLetter);
    const separatorDiv = createSeparatorDiv();
    lastExistingContact.insertAdjacentElement('afterend', letterDiv);
    letterDiv.insertAdjacentElement('afterend', separatorDiv);
    separatorDiv.insertAdjacentElement('afterend', newContactCard);
}


/**
 * Checks if the given contact's letter already exists in the contacts container.
 * 
 * @param {string} contactLetter - The letter of the contact.
 * @param {Array<HTMLElement>} contacts - The contacts container.
 * 
 * @author Robin
 */
function checkIfLetterExists(contactLetter, contacts) {
    for (const existingContact of contacts) {
        const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
        const existingContactLetter = existingContactName.charAt(0);
        if (existingContactLetter === contactLetter) {
            return true;
        }
    }
    return false;
}


/**
 * Removes empty letter headers from the contacts container.
 * 
 * @author Robin
 */
function removeEmptyLetterHeaders() {
    let container = getContactsContainer();
    let letterContainers = Array.from(container.querySelectorAll('.contacts-list-letter-container'));
    letterContainers.forEach(letterContainer => {
        let hasContacts = false;
        let nextSibling = letterContainer.nextElementSibling;
        while (nextSibling && !nextSibling.classList.contains('contacts-list-letter-container')) {
            if (nextSibling.classList.contains('contact')) {
                hasContacts = true;
                break;
            }
            nextSibling = nextSibling.nextElementSibling;
        }
        if (!hasContacts) {
            let separator = letterContainer.nextElementSibling;
            container.removeChild(letterContainer);
            if (separator && separator.classList.contains('seperator-contacts-list')) {
                container.removeChild(separator);
            }
        }
    });
}