/**
 * This function is used to render the page if the user refresh the page or switch from another HTML-page to this one.
 * 
 * @author: Robin
 */

// async function init() {
//     loadUsers();
//     checkAcceptPrivacyPolicy();
        // document.getElementById('msgBoxSignedUp').classList.add('d-none');
        // document.getElementById('registerContainer').classList.remove('d-none');
// }

/**
 * This function is used to block and reactivate the button, if the user accepts the privacy policy, inputs are not empty and the passwords match.
 * 
 * @author: Robin
 */
function checkAcceptPrivacyPolicy() {
    let checkbox = document.getElementById('checkbox');
    let buttonId = document.getElementById('signUpButton');
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password1').value;
    let confirmPassword = document.getElementById('password2').value;
    if (checkbox.checked && name !== '' && email !== '' && password !== '' && password === confirmPassword) {
        buttonId.classList.remove('signUpButtonFalse');
        buttonId.classList.add('signUpButtonTrue');
    } else {
        buttonId.classList.remove('signUpButtonTrue');
        buttonId.classList.add('signUpButtonFalse');
    }
}


async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

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


async function addUser() {
    // debugger;
    let msgBox = document.getElementById('msgBox');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password1');
    let confirmPassword = document.getElementById('password2');
    let newArray = [{ 'mail': email.value, 'name': name.value, 'password': password.value }];
    let actualUsers = await loadData('users');
    let actualisedUsers = [...newArray, ...actualUsers];

    if (actualUsers === '') {
        actualisedUsers = [...newArray];
    };

    for (let mailSearchIndex = 0; mailSearchIndex < actualUsers.length; mailSearchIndex++) {
        let mailToCheck = actualUsers[mailSearchIndex]['mail'];
        if (JSON.stringify(mailToCheck) === JSON.stringify(email.value)) {
            msgBox.innerHTML = 'User already exists';
            msgBox.classList.remove('d-none');
            await setTimeout(function () {
                msgBox.classList.add('d-none');
            }, 2000);
            return;
        }
    };
    await putNewUser(password, confirmPassword, msgBox, actualisedUsers);
}

async function putNewUser(password, confirmPassword, msgBox, actualisedUsers) {
    if (password.value === confirmPassword.value) {
        await putData('users', actualisedUsers);
        document.getElementById('registerContainer').classList.add('d-none');
        msgBoxSignedUp.classList.remove('d-none');
        setTimeout(function () {
            window.location.href = 'login.html?msg=Registrierung erfolgreich';
        }, 3000);
    } else {
        msgBox.innerHTML = `Ups! your password don't match.`;
        msgBox.classList.remove('d-none');
    }
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(user => user.email === email.value && user.password === password.value);
    if (user) {
        window.location.href = 'summary.html';
    } else {
        msgBox.classList.remove('d-none');
        msgBox.innerHTML = 'Login fehlgeschlagen';
    }
}