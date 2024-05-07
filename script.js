let baseUrl = 'https://join-ca44d-default-rtdb.europe-west1.firebasedatabase.app/';



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