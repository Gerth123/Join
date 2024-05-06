/**
 * This function is used to set a timeout and show the Login Container with changed CSS when the animation is finished.
 * 
 * @author: Robin
 */
function init() {
        document.getElementById('logoContainerSlide').classList.remove('logoContainerSlide');
        document.getElementById('logoContainerSlide').classList.add('logoContainerSlideLoaded');
        setTimeout(function() {
                    document.getElementById('wholeLoginContainer').classList.remove('d-none');
                    document.getElementById('logoContainerSlideImg').style.height = '12vh';
                }, 950);
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
