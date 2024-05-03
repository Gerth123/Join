const addTaskBtn = document.getElementById("board-header-add-btn");
const editBtn = document.getElementById("edit-btn");
const fullsize = document.getElementById("full-size-container");
const board = document.getElementById("board");
const editBoard = document.getElementById("edit-board");
const addBoard = document.getElementById("add-board");

const title = [
  {
    id: 1,
    title: "Not Started",
  },
  {
    id: 2,
    title: "In Progress",
  },
  {
    id: 3,
    title: "Await feedback",
  },
  {
    id: 4,
    title: "Done",
  },
];

const emptyData = [
  { id: 1, items: [] },
  { id: 2, items: [] },
  { id: 3, items: [] },
  { id: 4, items: [] },
];

///////////////////Render Boards//////////////////////
async function init() {
  await renderBoards();
}

async function renderKanban() {
  let data = read();
  let kanban = document.getElementById("kanban");
  kanban.innerHTML = "";
  for (let i = 0; i < title.length; i++) {
    const id = data[i]["id"];
    kanban.innerHTML += getKanbanContainer(id);
    getTitle(title[i], id);
    getContents(data[i]["items"], id);
  }
}

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

///////////////////Kanban APIs//////////////////////

/**
 *
 */

/**
 * Saves the data in the server.
 * @param {Object} data - saves the board data
 * @author Hanbit Chang
 */
function save(data) {
  localStorage.setItem("board-data", JSON.stringify(data));
}

/**
 * Reads the data in the server.
 * @author Hanbit Chang
 */
function read() {
  const json = localStorage.getItem("board-data");
  if (!json) return emptyData;
  return JSON.parse(json);
}
