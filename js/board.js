let icons;
let data;
let contacts;
let header = ["To do", "In progress", "Await feedback", "Done"];
let assignedContacts;

/**
 * Gets example data from local
 * @returns example data
 */
async function getExampleData() {
  const response = await fetch("../assets/data/example.json");
  return await response.json();
}

/**
 * Gets icons
 * @returns icon data
 */
async function getIcons() {
  const response = await fetch("assets/data/getIcons.json");
  return await response.json();
}

/**
 * On loading it inits the elements
 */
async function initBoard() {
  checkUserLogin();
  user = JSON.parse(localStorage.getItem("user"));
  userId = user.user_id;
  userData = await loadDataBackend(`api/users/profiles/${userId}/`);
  icons = await getIcons();
  renderBoards(userData.tasks);
  getEventListeners();
  getDropZones();
  await fillHeaderInitials();
}

/**
 * Renders the board
 */
async function renderBoards(tasks) {
  getBoardSection(tasks);
  getBoardContentsAll(tasks);
}

/**
 * Gets the item by id
 * @param {number} id
 * @returns item data
 */
async function getItemById(id) {
  let item = await loadDataBackend(`api/tasks/${id}/`);
  return item;
}

/**
 * Gets the board and checks if there are empty sections.
 * @param {Object} tasks
 */
function getBoardSection(tasks) {
  const boardSection = document.getElementById("board-card-section");
  boardSection.innerHTML = "";
  boardSection.innerHTML = '<div id="no-search-results" class="no-search-results d-none"><h1>No search results</h1></div>';
  for (let i = 0; i < 4; i++) {
    boardSection.innerHTML += getBoardContainer(i, header[i]);
    let empty = true;
    tasks.forEach(task => {
      if (task.status == i) {
        empty = false;
      }
    });
    if (empty) {
      getEmptyBoard(i);
    }
  }
}


/**
 * Retrieves the empty board container element and displays it by removing the "d-none" class from the container element.
 *
 * @return {void} This function does not return anything.
 */
function getEmptyBoard(id) {
  const containerElement = document.getElementById(`${id}`);
  const container = containerElement.querySelector("#no-content-img");
  const dropzone = containerElement.querySelector("#dropzone");
  dropzone.classList.add("big-zone");
  container.classList.remove("d-none");
}

function getBoardContentsAll(tasks) {
  let filled = false;
  for (let i = 0; i < 4; i++) {
    tasks.forEach(task => {
      if (task.status == i) {
        filled = true;
        getBoardContents(task, i);
      }
    });
    if (!filled) {
      getEmptyBoard(i);
    }
  }
}

/**
 * Gets the board container
 * @param {number} id
 * @returns html code
 */
function getBoardContainer(id, header) {
  return /*html*/ ` 
    <div id="${id}" class="board-card-content">
      <div class="board-header-task">
        <div class="board-text">${header}</div>
        <div class="board-add-btn button" onclick="addTaskBtnSmall(${id})"></div>
      </div>
      <div id="board-card-direction" class="board-card-direction">
        <img id="no-content-img" class="no-content-img d-none" src="assets/icons/no-tasks-todo.svg">
        <div id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone first-dropzone-mobile"></div>
      </div>
    </div>`;
}

/**
 * Gets the board contents
 * @param {Object} contents
 * @param {number} id
 */
async function getBoardContents(task, id) {
  const contentDirection = document.getElementById(`${id}`);
  const content = contentDirection.querySelector("#board-card-direction");
  content.innerHTML += getBoardCard(task);
  getBoardCardValues(task);
}

/**
 * Retrieves the values for the board card.
 *
 * @param {Object} card - The card object containing the category, priority, assigned, and subtasks.
 * @return {void} This function does not return a value.
 */
function getBoardCardValues(card) {
  getCategory(card["category"], card["id"]);
  getPriority(card["priority"], card["id"]);
  getAssigned(card["assigned"], card["id"]);
  getProgressBar(card["subtasks"], card["id"]);
}

/**
 * Gets the board card
 * @param {Object} card
 * @returns html code
 */
function getBoardCard(card, zoneSize) {
  return /*html*/ `
  <div id='${card["id"]}' class="board-card" draggable="true" ondragstart='doSetData(event, ${card["id"]})'>
    <img id="board-category" class="board-category">
    <div class="board-title">${card["title"]}</div>
    <div class="board-description">${card["description"]}</div> 
    <div class="board-progress-bar-container">
      <progress id="progress-bar" value="0" max="100"></progress>
      <label for="progress-bar"></label>
    </div>
    <div class="board-bottom-container">
      <div id="board-users" class="board-user-container">
      </div>
      <img id='board-priority' alt="">
    </div>
  </div> 
  <div  id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone ${zoneSize}"></div>`;
}

/**
 * Get board category
 * @param {string} category - board category
 * @param {number} id - board id
 */
function getCategory(category, id) {
  const content = document.getElementById(`${id}`);
  const boardCategory = content.querySelector("#board-category");
  let categoryName;
  if (category === 1) { categoryName = "user story" }
  else if (category === 2) { categoryName = "technical task" };
  boardCategory.src = icons["categoryIcons"][categoryName] || "";
}

/**
 * Get board priority
 * @param {string} priority - board priority
 * @param {number} id - board id
 */
function getPriority(priority, id) {
  const content = document.getElementById(`${id}`);
  const boardPriority = content.querySelector("#board-priority");

  boardPriority.src = icons["priorityIcons"][priority] || "";
}

/**
 * Get board assigned
 * @param {Object} assigned - board assigned user
 * @param {number} id - board id
 */
function getAssigned(assigned, id) {
  const content = document.getElementById(`${id}`);
  const boardUser = content.querySelector("#board-users");
  if (assigned != "") {
    let i = 0;
    assigned.forEach((user) => {
      let name = getInitials(user["name"]);
      if (i < 3)
        boardUser.innerHTML += /*html*/ `<div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}</div>`;
      i++;
    });
    if (i > 3) boardUser.innerHTML += /*html*/ `<div id="board-user" class="board-user" style="background-color:#2A3647">+${i - 3}</div>`;
  }
}

/**
 * Gets the progress bar
 * @param {Object} subtasks
 * @param {number} id
 */
function getProgressBar(subtasks, id) {
  let process = 0;
  if (subtasks == "") subtasks = [];
  for (let i = 0; i < subtasks.length; i++) {
    if (subtasks[i]["checked"] == true) process++;
  }
  setProgressBar(subtasks, process, id);
}

/**
 * Sets the progress bar based on the given subtasks, process, and id.
 *
 * @param {Array} subtasks - An array of subtasks.
 * @param {number} process - The number of completed subtasks.
 * @param {string} id - The id of the element to update the progress bar for.
 * @return {void} This function does not return a value.
 */
function setProgressBar(subtasks, process, id) {
  const content = document.getElementById(`${id}`);
  const progressBar = content.querySelector("#progress-bar");
  const progressBarLabel = content.querySelector('label[for="progress-bar"]');
  if (subtasks.length == 0) {
    const container = progressBar.closest(".board-progress-bar-container");
    container.classList.add("d-none");
  } else {
    progressBarLabel.textContent = `${process}/${subtasks.length} Subtasks`;
    progressBar.value = +(process / subtasks.length) * 100;
  }
}
