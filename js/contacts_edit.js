async function addContactToDOM(contact, contacts) {
    // const contactsNew = [...contacts, contact];
    // sortContacts(contactsNew);
    // displayContacts(contactsNew);
    insertContactCard(contact, contacts);
    clearInputFieldsAddContact();
  }
  
  /**
   * Inserts a new contact card into the contacts container at the correct position.
   * @param {Object} contact - The contact object containing name, mail, phone, etc.
   * @returns {Promise<void>}
   */
  async function insertContactCard(contact, oldContacts) {
    const container = getContactsContainer();
    const contactHTML = await generateContactHTML(contact);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contactHTML;
    const newContactCard = tempDiv.firstElementChild;
    const contacts = Array.from(container.querySelectorAll('.contact'));
    const contactLetter = contact.name.charAt(0).toUpperCase();
    let inserted = false;
    let letterExists = await checkIfLetterExists(contactLetter, contacts);
    for (const existingContact of contacts) {
      const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
      const existingContactLetter = existingContactName.charAt(0);
      if (!letterExists && contactLetter === 'A') {
        const contactsNew = [...oldContacts, contact];
        handleLoadedContacts(contactsNew);
        return;
      }
      if (letterExists === true && existingContactLetter === contactLetter) {
        if (contact.name.toUpperCase() < existingContactName) {
          container.insertBefore(newContactCard, existingContact);
          inserted = true;
          break;
        }
      } else if (existingContactLetter > contactLetter && !letterExists) {
        const letterDiv = createLetterDiv(contactLetter);
        const separatorDiv = createSeparatorDiv();
        const reversedContacts = [...contacts].reverse();
        let reversedExistingContact = null;
        for (const reversedContact of reversedContacts) {
          const reversedContactName = reversedContact.querySelector('.NameContact').innerText.toUpperCase();
          if (reversedContactName.charAt(0) < contactLetter) {
            reversedExistingContact = reversedContact;
            break;
          }
        }
        if (reversedExistingContact) {
          reversedExistingContact.insertAdjacentElement('afterend', letterDiv);
          letterDiv.insertAdjacentElement('afterend', separatorDiv);
          separatorDiv.insertAdjacentElement('afterend', newContactCard);
          inserted = true;
          break;
        }
      }
  
    }
    if (!inserted) {
      if (letterExists) {
        let lastLetterContact = null;
        for (const existingContact of contacts) {
          const existingContactName = existingContact.querySelector('.NameContact').innerText.toUpperCase();
          if (existingContactName.charAt(0) === contactLetter) {
            lastLetterContact = existingContact;
          }
        }
        if (lastLetterContact) {
          lastLetterContact.insertAdjacentElement('afterend', newContactCard);
        }
      } else {
        const letterDiv = createLetterDiv(contactLetter);
        const separatorDiv = createSeparatorDiv();
        const firstElement = container.firstChild;
        container.insertAdjacentElement('afterbegin', separatorDiv);
        separatorDiv.insertAdjacentElement('beforebegin', letterDiv);
        container.insertAdjacentElement('afterend', newContactCard);
      }
    }
    setupContactClickEvents();
    removeEmptyLetterHeaders();
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
      console.log(existingContactLetter, contactLetter)
      if (existingContactLetter === contactLetter) {
        return true;
      }
    }
    return false;
  }
  
  
  /**
   * Removes empty letter headers from the contacts container.
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