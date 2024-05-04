let users = [
    { 'email': 'admin@test.de', 'password': 'admin' },
];

/**
 * This function is used to render the page if the user refresh the page or switch from another HTML-page to this one.
 * 
 * @author: Robin
 */

// async function init() {
//     loadUsers();
//     checkAcceptPrivacyPolicy();
// }

/**
 * This function is used to toggle the visibility of the password input field.
 * 
 * @param {number} number - the number of the password input field and password img.
 * 
 * @author: Robin
 */
function togglePasswordVisbility(number) {
    let passwordInput = document.getElementById('password' + number);
    let passwordImg = document.getElementById('signUpFormImgPassword' + number);
    if (passwordInput.type === 'password' && passwordInput.value.length >= 1) {
        passwordInput.type = 'text';
        passwordImg.src = 'assets/img/unlock.png';
        passwordImg.style.cursor = 'pointer';
    } else {
        passwordInput.type = 'password';
        passwordImg.src = 'assets/img/lock.svg';
        passwordImg.style.cursor = 'auto';
    }
}

/**
 * This function is used to block and reactivate the button, if the user accepts the privacy policy.
 * 
 * @author: Robin
 */

function checkAcceptPrivacyPolicy() {
    let checkbox = document.getElementById('checkbox');
    let buttonId = document.getElementById('signUpButton');
    if (checkbox.checked) {
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


async function register() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
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


function addUser() {
    let msgBox = document.getElementById('msgBox');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password1');
    let confirmPassword = document.getElementById('password2');
    if (password.value === confirmPassword.value) {
        postData('contacts', { 'name': name.value, 'mail': email.value, 'password': password.value });
        window.location.href = 'login.html?msg=Registrierung erfolgreich';
    }else {
        msgBox.classList.remove('d-none');
    }
    
// const UrlParams = new URLSearchParams(window.location.search);
// const msg = UrlParams.get('msg');
// if (msg) {
//     msgBox.classList.remove('d-none');
//     msgBox.innerHTML = msg;
// } else {
//     msgBox.classList.add('d-none');
// }    
    //Weiterleitung zu Login Seite & Nachricht anzeigen: "Registrierung erfolgreich"
   
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