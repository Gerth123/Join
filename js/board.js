const boardCard = document.getElementById("board-card");
const closeBtn = document.getElementById("close-btn");
const closeBtnEdit = document.getElementById("close-btn-edit");
const boardBtn = document.getElementById("board-header-add-btn");
const closeBtnAdd = document.getElementById("close-btn-add");
const editBtn = document.getElementById("edit-btn");

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

closeBtn.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});

closeBtnEdit.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});

boardBtn.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
});

closeBtnAdd.addEventListener("click", () => {
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
});

editBtn.addEventListener("click", () => {
  board.classList.add("d-none");
  editBoard.classList.remove("d-none");
  addBoard.classList.add("d-none");
});
