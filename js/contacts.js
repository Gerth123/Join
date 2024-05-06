document.addEventListener("DOMContentLoaded", function () {
    const addContactButton = document.querySelector(".addContactButton");
    const overlay = document.getElementById("overlay");
  
    addContactButton.addEventListener("click", function () {
      overlay.style.display = "block";
    });
});


