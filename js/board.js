async function getExampleData() {
  const response = await fetch("/assets/data/example.json");
  return await response.json();
}

async function getIcons() {
  const response = await fetch("/assets/data/getIcons.json");
  return await response.json();
}

let icons;
let emptyData;
///////////////////Render Boards//////////////////////
/**
 * On loading the site the function triggers
 * @author Hanbit Chang
 */
async function init() {
  emptyData = await getExampleData();
  icons = await getIcons();
  await renderBoards();
  save(emptyData);
  getEventListeners();
}

function getEventListeners() {
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  onClickFullSizeBoard(fullsize, board, editBoard, addBoard);
  onClickCloseFullSize(fullsize);
  onClickAddTaskBoard(fullsize, board, editBoard, addBoard);
  onClickEditBoard(board, editBoard, addBoard);
}

function onClickFullSizeBoard(fullsize, board, editBoard, addBoard) {
  const boardCard = document.querySelectorAll(".board-card");
  boardCard.forEach((e) =>
    e.addEventListener("click", () => {
      fullsize.classList.remove("d-none");
      board.classList.remove("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.add("d-none");
      let id = e.id;
      let contentId = e.parentNode.id;
      getFullSizeBoard(id, contentId);
    })
  );
}

function onClickCloseFullSize(fullsize) {
  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((e) =>
    e.addEventListener("click", () => {
      fullsize.classList.add("d-none");
    })
  );
}

function onClickAddTaskBoard(fullsize, board, editBoard, addBoard) {
  const addTaskBtn = document.getElementById("board-header-add-btn");
  addTaskBtn.addEventListener("click", () => {
    fullsize.classList.remove("d-none");
    board.classList.add("d-none");
    editBoard.classList.add("d-none");
    addBoard.classList.remove("d-none");
  });
}

function onClickEditBoard(board, editBoard, addBoard) {
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", () => {
    board.classList.add("d-none");
    editBoard.classList.remove("d-none");
    addBoard.classList.add("d-none");
  });
}

async function renderBoards() {
  const data = read();
  getBoardSection(data);
}

function getFullSizeBoard(id, contentId) {
  let itemData = getItemById(id, contentId);
  let title = document.querySelector(".full-size-title");
  let description = document.querySelector(".full-size-description");
  let date = document.querySelector("#full-size-due-date");
  title.textContent = `${itemData["title"]}`;
  description.textContent = `${itemData["description"]}`;
  date.textContent = "";
  date.textContent += `${itemData["date"]}`;
  getFullSizePriority(itemData["priority"]);
  getFullSizeCategory(itemData["category"]);
  getFullSizeAssigned(itemData["assigned"]);
  getFullSizeSubtask(itemData["subtasks"]);
}

function getFullSizePriority(priority) {
  const fullSizePriority = document.querySelector(".full-size-priority-icon");
  fullSizePriority.src = icons["priorityFullSizeIcons"][priority] || "";
}

function getFullSizeCategory(category) {
  const fullSizeCategory = document.querySelector("#full-size-category");
  fullSizeCategory.src = icons["categoryFullSizeIcons"][category] || "";
}

function getFullSizeAssigned(assigned) {
  const fullSizeAssigned = document.querySelector("#full-size-assigned-users");
  fullSizeAssigned.innerHTML = "";
  assigned.forEach((user) => {
    fullSizeAssigned.innerHTML += /*html*/ `
    <div class="full-size-assign-user">
      ${user["name"]} ${user["lastName"]}  
    </div>`;
  });
}

function getFullSizeSubtask(subtasks) {
  const fullSizeSubtasks = document.getElementById("full-size-subtasks-tasks");
  fullSizeSubtasks.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    fullSizeSubtasks.innerHTML += /*html*/ `
    <input type="checkbox" id="subtask-${i}">
    <label for="subtask-${i}">${subtasks[i]["task"]}</label>
    `;
  }
  for (let i = 0; i < subtasks.length; i++) {
    let check = document.getElementById(`subtask-${i}`);
    if (subtasks[i]["checked"]) {
      check.checked = true;
    }
  }
}

function getItemById(id, contentId) {
  let data = read();
  const itemList = data.find((items) => items["id"] == contentId);
  const item = itemList["items"].find((items) => items["id"] == id);
  return item;
}

function getBoardSection(data) {
  const boardSection = document.getElementById("board-card-section");
  for (let i = 0; i < data.length; i++) {
    const id = data[i]["id"];
    boardSection.innerHTML += getBoardContainer(id);
    getBoardContents(data[i]["items"], id);
  }
}

function getBoardContainer(id) {
  return /*html*/ `
    <div id="${id}" class="board-card-content">
      <div id="dropzone" class="board-card-dropzone"></div>
    </div>
 `;
}

function getBoardContents(contents, id) {
  let content = document.getElementById(`${id}`);
  contents.forEach(function (card) {
    content.innerHTML += /*html*/ `
      <div id='${card["id"]}' class="board-card" draggable="true">
        <img id="board-category" class="board-category">
        <div class="board-title">${card["title"]}</div>
        <div class="board-description">${card["description"]}</div> 
        <div class="board-progress-bar-container">
          <progress id="progress-bar" value="0" max="100"></progress>
          <label for="progress-bar"></label>
        </div>
        <div class="board-bottom-container">
          <div id="board-user" class="board-user-container">
          </div>
          <img id='board-priority' alt="">
        </div>
        <div  id="dropzone" class="kanban-dropzone"></div>
      </div>
    `;
    getCategory(card["category"], card["id"]);
    getPriority(card["priority"], card["id"]);
    getAssigned(card["assigned"], card["id"]);
    getProgressBar(card["subtasks"], card["id"]);
  });
}

/**
 * Get board category
 * @param {string} category - board category
 * @param {number} id - board id
 */
function getCategory(category, id) {
  let content = document.getElementById(`${id}`);
  let boardCategory = content.querySelector("#board-category");
  boardCategory.src = icons["categoryIcons"][category] || "";
}

/**
 * Get board priority
 * @param {string} priority - board priority
 * @param {number} id - board id
 */
function getPriority(priority, id) {
  let content = document.getElementById(`${id}`);
  let boardPriority = content.querySelector("#board-priority");
  boardPriority.src = icons["priorityIcons"][priority] || "";
}

/**
 * Get board assigned
 * @param {Object} assigned - board assigned user
 * @param {number} id - board id
 */
function getAssigned(assigned, id) {
  let content = document.getElementById(`${id}`);
  let boardUser = content.querySelector("#board-user");
  assigned.forEach((user) => {
    let name = Array.from(`${user["name"]}`)[0];
    let lastName = Array.from(`${user["lastName"]}`)[0];
    boardUser.innerHTML += /*html*/ `
    <div class="board-user">${name}${lastName}</div>
   `;
  });
}

function getProgressBar(subtasks, id) {
  let content = document.getElementById(`${id}`);
  let progressBar = content.querySelector("#progress-bar");
  let progressBarLabel = content.querySelector('label[for="progress-bar"]');
  let process = 0;
  for (let i = 0; i < subtasks.length; i++) {
    if (subtasks[i]["checked"] == true) {
      process++;
    }
  }
  progressBarLabel.textContent = `${process}/${subtasks.length} Subtasks`;
  progressBar.value = +(process / subtasks.length) * 100;
}
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
