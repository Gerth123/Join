let baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';

let actualUsersNumber = '';


async function loadData(path='') {
    let response = await fetch(baseUrl + path + '.json');
    return responseToJson = await response.json();
}

async function postData(path='', data={}) {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

// postData('', {'name':'alice'});

async function deleteData(path='') {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}

async function putData(path='', data={}) {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}





function openNewTab(newUrl) {
    newWindow = window.open(newUrl, '_blank');
}

// Funktion zum Schließen des neuen Tabs und Zurückkehren zum vorherigen Tab
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