/**
 * The base URL for the Firebase database.
 */
let baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * This function is used to fetch data from the Firebase database.
 * 
 * @param {string} path - The path to fetch data from.
 * 
 * @author: Robin
 */
async function loadData(path = '') {
    let response = await fetch(baseUrl + path + '.json');
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
async function postData(path = '', data = {}) {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

/**
 * This function is used to delete data from the Firebase database.
 * 
 * @param {string} path - The path to delete data from.
 * 
 * @author: Robin
 */
async function deleteData(path = '') {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}

/**
 * This function is used to update data in the Firebase database.
 * 
 * @param {string} path - The path to update data in.
 * @param {object} data - The data to update.
 * 
 * @author: Robin
 */
async function putData(path = '', data = {}) {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'PUT',
        header: {
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
    let userId = await getUserIdFormUrl();
    let actualUsersName = await loadData('users/' + userId + '/name');
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
