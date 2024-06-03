/**
 * This function is used to show an animation with the join logo, to set a timeout and show the Login Container with changed CSS when the animation is finished.
 * 
 * @author: Robin
 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoContainerSlide').classList.remove('logoContainerSlide');
    document.getElementById('logoContainerSlide').classList.add('logoContainerSlideLoaded');
    setTimeout(function () {
        document.getElementById('wholeLoginContainer').classList.remove('d-none');
        document.getElementById('logoContainerSlideImg').style.height = '12vh';
    }, 900);
    loadUserData();
});

/**
 * This function is used to toggle the visibility of the password input field, if the mouse moves over the lock image.
 * 
 * @author: Robin
 */
function togglePasswordVisbility() {
    let passwordInput = document.getElementById('password');
    let passwordImg = document.getElementById('logInFormImgPassword');
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
 * This function is used to check if the user exists and if the password is correct. If both conditions are correct, the user is logged in.
 * 
 * @author: Robin
 */
async function checkUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let actualUsers = await loadData('users');
    let found = false;
    let actualMailSearchIndex;
    for (let mailSearchIndex in actualUsers) {
        let user = actualUsers[mailSearchIndex];
        if (user && user.mail === email) {
            actualMailSearchIndex = mailSearchIndex;
            if (user.password === password) {
                window.location.href = `summary.html?msg=Login erfolgreich&actualUsersNumber=${mailSearchIndex}`;
                found = true;
                break;
            }
        }
    }
    await userNotFound(found, actualUsers, actualMailSearchIndex);
    await saveUserData(email, password);
}

/** 
 * This function is used to show an error message if the user is not found.
 * 
 * @param {boolean} found - If the user is found or not.
 * @param {Array} actualUsers - The array of actual users.
 * @param {number} actualMailSearchIndex - The index of the user in the array.
 * 
 * @author: Robin
 */
async function userNotFound(found, actualUsers, actualMailSearchIndex) {
    if (!found) {
        let msgBox = document.getElementById('msgBox');
        msgBox.classList.remove('d-none');
        let msgBoxText = document.getElementById('msgBoxText');
        console.log(actualUsers);
        if (actualMailSearchIndex !== undefined) {
            msgBoxText.innerHTML = 'Wrong password. Please try again!';
        } else {
            msgBoxText.innerHTML = 'Mail not registered. Please sign up first!';
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        msgBox.classList.add('d-none');
    }
}

/**
 * This function is used to save the user data in local storage, if the checkbox is checked.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * 
 * @author: Robin
 */
function saveUserData(email, password) {
    let rememberMe = document.getElementById('checkbox').checked;
    if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    }
}

/**
 * This function is used to load the user data from local storage, if the checkbox is checked and 
 * clear the Input Fields if the checkbox is not checked if the checkbox is not checked.
 * 
 * @author: Robin
 */
function loadUserData() {
    let rememberMe = document.getElementById('checkbox').checked;
    let storedEmail = localStorage.getItem('email');
    let storedPassword = localStorage.getItem('password');
    if (rememberMe && storedEmail && storedPassword) {
        document.getElementById('email').value = storedEmail;
        document.getElementById('password').value = storedPassword;
        document.getElementById('checkbox').checked = true;
    } else {
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('checkbox').checked = false;
    }
}

/**
 * This function is used to log in as a guest if the user is not registered.
 * 
 * @author: Robin
 */
async function guestLogIn() {
    let users = await loadData('users');
    for (let [index, user] of Object.entries(users)) {
        if (user && user.mail === 'test@testmail.com') {
            window.location.href = `summary.html?msg=Testlogin erfolgreich&actualUsersNumber=${index}`;
        }
    }
}

/**
 * This function is used to add an event listener to the background element, if the animation is ended, the login container is shown.
 * 
 * @author: Robin
 */
document.addEventListener("DOMContentLoaded", function () {
    var backgroundElement = document.querySelector('.responsiveBackgroundForSlide');
    backgroundElement.addEventListener('animationend', function (event) {
        if (event.animationName === 'changeColor') {
            document.getElementById('wholeLoginContainer').classList.remove('d-none');
            let logoContainerSlideWhite = document.getElementById('logoContainerSlideWhite');
            if (logoContainerSlideWhite) {
                logoContainerSlide.style.zIndex = "999";
                logoContainerSlideWhite.style.display = "none";
            }
        }
    });
});