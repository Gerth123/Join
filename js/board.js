const addTaskBtn = document.getElementById("board-header-add-btn");
const editBtn = document.getElementById("edit-btn");
const fullsize = document.getElementById("full-size-container");
const board = document.getElementById("board");
const editBoard = document.getElementById("edit-board");
const addBoard = document.getElementById("add-board");

const boardCard = document.querySelectorAll(".board-card");
boardCard.forEach((e) =>
  e.addEventListener("click", () => {
    fullsize.classList.remove("d-none");
    board.classList.remove("d-none");
    editBoard.classList.add("d-none");
    addBoard.classList.add("d-none");
  })
);

const closeBtn = document.querySelectorAll(".close-btn");
closeBtn.forEach((e) =>
  e.addEventListener("click", () => {
    fullsize.classList.add("d-none");
  })
);

addTaskBtn.addEventListener("click", () => {
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
