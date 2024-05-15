/**
 * This function is used to set a timeout and show the Login Container with changed CSS when the animation is finished.
 * 
 * @author: Robin
 */
function init() {
    document.getElementById('logoContainerSlide').classList.remove('logoContainerSlide');
    document.getElementById('logoContainerSlide').classList.add('logoContainerSlideLoaded');
    setTimeout(function () {
        document.getElementById('wholeLoginContainer').classList.remove('d-none');
        document.getElementById('logoContainerSlideImg').style.height = '12vh';
    }, 850);
}

/**
 * This function is used to toggle the visibility of the password input field.
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

async function checkUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let actualUsers = await loadData('users');
    let found = false;

    for (let mailSearchIndex = 0; mailSearchIndex < actualUsers.length; mailSearchIndex++) {
        if (actualUsers[mailSearchIndex] === null) {
            continue;
        } else {
            let mailToCheck = actualUsers[mailSearchIndex]['mail'];
            if (JSON.stringify(mailToCheck) === JSON.stringify(email) && JSON.stringify(actualUsers[mailSearchIndex]['password']) === JSON.stringify(password)) {
                actualUsersNumber = mailSearchIndex;
                window.location.href = `summary.html?msg=Login erfolgreich, Gratuliere ${actualUsers[mailSearchIndex]['name']}&actualUsersNumber=${mailSearchIndex}`;
                found = true;
                break;
            }
        }
    }

    if (!found) {
        let msgBox = document.getElementById('msgBox');
        msgBox.classList.remove('d-none');
        let msgBoxText = document.getElementById('msgBoxText');
        if (actualUsers.some(user => JSON.stringify(user['mail']) === JSON.stringify(email))) {
            msgBoxText.innerHTML = 'Wrong password. Please try again!';
        } else {
            msgBoxText.innerHTML = 'Mail not registered. Please sign up first!';
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        msgBox.classList.add('d-none');
    }
}

