// document.addEventListener("DOMContentLoaded", function() {
//     setTimeout(function() {
//         document.body.classList.add("loaded");
//         document.body.classList.remove("logo-container img");
//     }, 3000);
// });

function init() {
        document.getElementById('logoContainerSlide').classList.remove('logoContainerSlide');
        document.getElementById('logoContainerSlide').classList.add('logoContainerSlideLoaded');
}