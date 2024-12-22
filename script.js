/**
 * The base URL for the Backend.
 */
let baseUrlBackend = 'http://127.0.0.1:8000/';

/**
 * This function is used to fetch data from the Backend.
 * 
 * @param {string} path - The path to fetch data from.
 * 
 * @author: Robin
 */
async function loadDataBackend(path = '') {
    let response = await fetch(baseUrlBackend + path);
    return responseToJson = await response.json();
}

/**
 * This function is used to post data to the Firebase database.
 * 
 * @param {string} path - The path to post data to.
 * @param {object} data - The data to post.
 * 
 * @author: Robin
 */
async function postDataBackend(path = '', data = {}) {
    let response = await fetch(baseUrlBackend + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

/**
 * This function is used to delete data from the Backend.
 * 
 * @param {string} path - The path to delete data from.
 * 
 * @author: Robin
 */
async function deleteDataBackend(path = '') {
    let response = await fetch(baseUrlBackend + path, {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}

/**
 * This function is used to update data in the Backend.
 * 
 * @param {string} path - The path to update data in.
 * @param {object} data - The data to update.
 * 
 * @author: Robin
 */
async function putDataBackend(path = '', data = {}) {
    let response = await fetch(baseUrlBackend + path, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

/**
 * This function is used to change the HTML page and send the actual number of users to the new page.
 * 
 * @param {string} newUrl - The new HTML page.
 *  
 * @author: Robin
 */
function openNewTab(newUrl) {
    newWindow = window.open(newUrl, '_blank');
}

/**
 * This function is used to close the actual tab and go back to the last tab.
 * 
 * @author: Robin
 */
function goBackToLastTab() {
    window.close();
}

/**
 * This function is used to change the HTML page and send the actual number of users to the new page.
 * 
 * @param {string} page - The new HTML page.
 * 
 * @author: Robin
 */
function changeHtmlPage(page) {
    let urlParams = new URLSearchParams(window.location.search);
    let actualUsersNumber = urlParams.get('actualUsersNumber');
    window.location.href = page + `?msg=welcome&actualUsersNumber=${actualUsersNumber}`;
}

/**
 * This function is used to go back to the last HTML page without closing it.
 * 
 * @author: Robin
 */
function goBackToLastTabWithoutClosing() {
    window.history.back();
}

/**
 * this function is used to fill the header initials.
 * 
 * @author: Robin
 */

async function fillHeaderInitials() {
    let user = JSON.parse(localStorage.getItem('user'));
    let actualUsersName = user.username;
    document.getElementById('headerInitials').innerHTML = getInitialsUniversal(actualUsersName);
}

/**
 * Generates initials from a name string.
 * 
 * @param {string} name - The full name from which initials are generated.
 * @returns {string} - The initials extracted from the name.
 * 
 * Author: Elias
 */
function getInitialsUniversal(name) {
    const words = name.split(' ');
    const initials = words.map(word => word.charAt(0)).join('').toUpperCase();
    return initials;
}

/**
 * This function is used to return the id of the actual user from the URL.
 * 
 * @author: Robin
 */
function getUserIdFormUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    let actualUsersNumber = urlParams.get('actualUsersNumber');
    return actualUsersNumber;
}
