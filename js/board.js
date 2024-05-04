async function getExampleData() {
  const response = await fetch("/assets/data/example.json");
  return await response.json();
}

const categoryIcons = {
  "user story": "/assets/icons/board/user_story.svg",
  "technical task": "/assets/icons/board/technical_task.svg",
};

const categoryFullSizeIcons = {
  "user story": "/assets/icons/board/fullsize/user_story_big.svg",
  "technical task": "/assets/icons/board/fullsize/technical_task_big.svg",
};

const priorityIcons = {
  low: "/assets/icons/board/priority/low.svg",
  medium: "/assets/icons/board/priority/medium.svg",
  urgent: "/assets/icons/board/priority/urgent.svg",
};

const priorityFullSizeIcons = {
  low: "/assets/icons/board/priority/low_box.svg",
  medium: "/assets/icons/board/priority/medium_box.svg",
  urgent: "/assets/icons/board/priority/urgent_box.svg",
};

///////////////////Render Boards//////////////////////
/**
 * On loading the site the function triggers
 * @author Hanbit Chang
 */
async function init() {
  const emptyData = await getExampleData();
  await renderBoards();
  save(emptyData);
  getEventListeners();
}

function getEventListeners() {
  const boardCard = document.querySelectorAll(".board-card");
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  const addTaskBtn = document.getElementById("board-header-add-btn");
  const editBtn = document.getElementById("edit-btn");

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
}

async function renderBoards() {
  let data = read();
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
  let fullSizePriority = document.querySelector(".full-size-priority-icon");
  fullSizePriority.src = priorityFullSizeIcons[priority] || "";
}

function getFullSizeCategory(category) {
  let fullSizeCategory = document.querySelector("#full-size-category");
  fullSizeCategory.src = categoryFullSizeIcons[category] || "";
}

function getFullSizeAssigned(assigned) {
  let fullSizeAssigned = document.querySelector("#full-size-assigned-users");
  fullSizeAssigned.innerHTML = "";
  assigned.forEach((user) => {
    fullSizeAssigned.innerHTML += /*html*/ `
    <div class="full-size-assign-user">
      ${user["name"]} ${user["lastName"]}  
    </div>`;
  });
}

function getFullSizeSubtask(subtasks) {
  let fullSizeSubtasks = document.getElementById("full-size-subtasks-tasks");
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
    // getTitle(title[i], id);
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
        <!-- <div id='input-${card["id"]}' contenteditable class="kanban-item-input">${card["content"]}</div> -->
        <!-- <div onclick='deleteContent(${card["id"]})'>x</div> -->
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
  boardCategory.src = categoryIcons[category] || "";
}

/**
 * Get board priority
 * @param {string} priority - board priority
 * @param {number} id - board id
 */
function getPriority(priority, id) {
  let content = document.getElementById(`${id}`);
  let boardPriority = content.querySelector("#board-priority");
  boardPriority.src = priorityIcons[priority] || "";
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
