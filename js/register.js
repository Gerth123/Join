/**
 * This function is used to block and reactivate the button, if the user accepts the privacy policy and the inputs are not empty.
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
    if (checkbox.checked && name !== '' && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
        buttonId.classList.remove('signUpButtonFalse');
        buttonId.classList.add('signUpButtonTrue');
    } else {
        buttonId.classList.remove('signUpButtonTrue');
        buttonId.classList.add('signUpButtonFalse');
    }
}

/**
 * This function is used to add a new user to the database.
 */
async function addUser() {
    let msgBox = document.getElementById('msgBox');
    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password1');
    let confirmPassword = document.getElementById('password2');
    let newArray = { 'email': email, 'username': username, 'password': password.value };
    let actualUsers = await loadDataBackend('api/users/profiles/');
    let mailExists = await checkMail(msgBox, email, actualUsers);
    if (mailExists) return;
    let nameChecked = await checkName(msgBox, username, actualUsers);
    if (!nameChecked) return;
    await putNewUser('api/users/registration/', newArray, msgBox, password.value, confirmPassword.value);
}



/**
 * This function checks if the user email already exists in the database.
 * 
 * @param {Element} msgBox - The message box element to show if the email already exists.
 * @param {string} email - The email to check.
 * @param {Array} actualUsers - The array of actual users.
 * 
 * @returns {boolean} - Returns true if the email exists, otherwise false.
 * @author: Robin
 */
async function checkMail(msgBox, email, actualUsers) {
    let userExists = await checkUserProperty(actualUsers, 'email', email, msgBox, 'User already exists. Please use another Mail-Adress!');
    return userExists;
}

/**
 * This function checks if the user name is valid.
 * 
 * @param {Element} msgBox - The message box element to show if the name is invalid.
 * @param {string} fullName - The full name of the user.
 * 
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 * @author: Robin
 */
async function checkName(msgBox, fullName, actualUsers) {
    let nameParts = fullName.trim().split(' ');

    if (nameParts.length < 2) {
        let msgBoxText = document.getElementById('msgBoxText');
        msgBoxText.innerHTML = 'Please enter your full name (at least two words).';
        msgBox.classList.remove('d-none');
        await new Promise(resolve => setTimeout(() => {
            msgBox.classList.add('d-none');
            resolve();
        }, 2000));
        return false;
    }

    let nameExists = await checkUserProperty(actualUsers, 'username', fullName, msgBox, 'User with this name already exists. Please use a different name!');
    return !nameExists;
}

async function checkUserProperty(users, property, value, msgBox, errorMessage) {
    for (const user of users) {
        if (user && user[property] === value) {
            let msgBoxText = document.getElementById('msgBoxText');
            msgBoxText.innerHTML = errorMessage;
            msgBox.classList.remove('d-none');
            await new Promise(resolve => setTimeout(() => {
                msgBox.classList.add('d-none');
                resolve();
            }, 2000));
            return true;
        }
    }
    return false;
}

/**
 * This function checks if the user password and confirm password are the same and shows a message if they are not.
 * If the password and confirm password are the same, the user is added to the database and gets to the summary page.
 * 
 * @param {Element} password - The password input element.
 * @param {Element} confirmPassword - The confirm password input element.
 * @param {Element} msgBox - The message box element to show if the passwords do not match.
 * @param {Array} actualisedUsers - The array of actual users.
 * 
 * @author: Robin
 */
async function putNewUser(path, newArray, msgBox, password, confirmPassword) {
    if (password.value === confirmPassword.value) {
        let response = await postDataBackend(path, newArray);
        localStorage.setItem('user', JSON.stringify(response));
        document.getElementById('registerContainer').classList.add('d-none');
        let msgBoxSignedUp = document.getElementById('msgBoxSignedUp');
        msgBoxSignedUp.classList.remove('d-none');
        setTimeout(function () {
            window.location.href = 'login.html?msg=Registrierung erfolgreich';
        }, 3000);
    } else {
        let msgBoxText = document.getElementById('msgBoxText');
        msgBoxText.innerHTML = `Ups! your password don't match.`;
        msgBox.classList.remove('d-none');
        await new Promise(resolve => setTimeout(() => {
            msgBox.classList.add('d-none');
            resolve();
        }, 2000));
    }
}