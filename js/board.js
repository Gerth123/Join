const board = document.getElementById("board-card");
const closebtn = document.getElementById("close-btn");

board.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.remove("d-none");
});

closebtn.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});
