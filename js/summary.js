/** 
 * Generates a greeting message based on the current time:
 * - 'Good morning' before 12 PM,
 * - 'Good afternoon' between 12 PM and 6 PM,
 * - 'Good evening' otherwise.
 * Displays the greeting in an element with id 'greetingText'.
 * 
 * Author: Elias
 */
document.addEventListener('DOMContentLoaded', function () {
    let today = new Date();
    let curHr = today.getHours();
    let greeting;

    if (curHr < 12) {
        greeting = 'Good morning';
    } else if (curHr < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    document.getElementById('greetingText').textContent = greeting;
});