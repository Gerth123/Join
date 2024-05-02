const boardCard = document.getElementById("board-card");
const boardBtn = document.getElementById("board-header-add-btn");
const editBtn = document.getElementById("edit-btn");

const closeBtn = document.querySelectorAll(".close-btn");
closeBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    const fullsize = document.getElementById("full-size-container");
    fullsize.classList.add("d-none");
  })
);

const board = document.getElementById("board");
const editBoard = document.getElementById("edit-board");
const addBoard = document.getElementById("add-board");

boardCard.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.remove("d-none");
  board.classList.remove("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.add("d-none");
});

boardBtn.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
});

editBtn.addEventListener("click", () => {
  board.classList.add("d-none");
  editBoard.classList.remove("d-none");
  addBoard.classList.add("d-none");
});
