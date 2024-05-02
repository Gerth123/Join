const board = document.getElementById("board-card");
const closeBtn = document.getElementById("close-btn");
const closeBtnEdit = document.getElementById("close-btn-edit");

board.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.remove("d-none");
});

closeBtn.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});

closeBtnEdit.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});
