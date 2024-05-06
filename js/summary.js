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