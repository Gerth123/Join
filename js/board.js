let icons;
let data;
let contacts;
let header = ["To do", "In progress", "Await feedback", "Done"];

/**
 * Gets example data from local
 * @returns example data
 */
async function getExampleData() {
  const response = await fetch("/assets/data/example.json");
  return await response.json();
}

/**
 * Gets icons
 * @returns icon data
 */
async function getIcons() {
  const response = await fetch("/assets/data/getIcons.json");
  return await response.json();
}

/**
 * On loading it inits the elements
 */
async function initBoard() {
  data = await getData("tasks");
  contacts = await getData("contacts");
  for (let i = 0; i < data.length; i++) {
    data[i] = await getAssignedKeyByName(data[i], contacts);
  }
  icons = await getIcons();
  renderBoards(data);
  getEventListeners();
  getDropZones();
  await fillHeaderInitials();
}

/**
 * Retrieves the assigned key by name from the given data object using the contacts array.
 *
 * @param {Object} data - The data object containing items with assigned names.
 * @param {Array} contacts - The array of contacts.
 * @return {Object} The modified data object with any invalid assigned names removed.
 */
function getAssignedKeyByName(data, contacts) {
  for (const item of data.items) {
    let i = 0;
    for (i = 0; i < item.assigned.length; i++) {
      let assigned = item.assigned[i];
      const contactExists = contacts.some((contact) => contact && contact.name == assigned.name);
      if (!contactExists) {
        const index = item.assigned.findIndex((assign) => assign.name == item.assigned[i].name);
        item.assigned.splice(index, 1);
        i = -1;
      }
    }
  }
  return data;
}

/**
 * Renders the board
 */
async function renderBoards(data) {
  getBoardSection(data);
  getBoardContentsAll(data);
}

/**
 * Gets the item by id
 * @param {number} id
 * @param {number} contentId
 * @returns item data
 */
async function getItemById(id, contentId) {
  // let data = await getData("tasks");
  let itemList = data.find((items) => items["id"] == contentId);
  let item = itemList["items"].find((items) => items["id"] == id);
  return item;
}

/**
 * Gets the board
 * @param {Object} data
 */
function getBoardSection(data) {
  const boardSection = document.getElementById("board-card-section");
  boardSection.innerHTML = "";
  boardSection.innerHTML = '<div id="no-search-results" class="no-search-results d-none"><h1>No search results</h1></div>';
  for (let i = 0; i < data.length; i++) {
    const id = data[i]["id"];
    const items = data[i]["items"];
    boardSection.innerHTML += getBoardContainer(id, header[i]);
    if (items == "") {
      let containerElement = document.getElementById(`${id}`);
      let container = containerElement.querySelector("#no-content-img");
      let dropzone = containerElement.querySelector("#dropzone");
      dropzone.classList.add("big-zone");
      container.classList.remove("d-none");
    }
    // getBoardContents(data[i]["items"], id);
  }
}

function getBoardContentsAll(data) {
  for (let i = 0; i < data.length; i++) {
    const id = data[i]["id"];
    getBoardContents(data[i]["items"], id);
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
        <img id="no-content-img" class="no-content-img d-none" src="/assets/icons/no-tasks-todo.svg">
        <div id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone first-dropzone-mobile"></div>
      </div>
    </div>`;
}

/**
 * Gets the board contents
 * @param {Object} contents
 * @param {number} id
 */
function getBoardContents(contents, id) {
  const contentDirection = document.getElementById(`${id}`);
  const content = contentDirection.querySelector("#board-card-direction");

  if (contents != "") {
    let i = 0;
    contents.forEach(function (card) {
      if (i < contents.length - 1) {
        content.innerHTML += getBoardCard(card);
        getCategory(card["category"], card["id"]);
        getPriority(card["priority"], card["id"]);
        getAssigned(card["assigned"], card["id"]);
        getProgressBar(card["subtasks"], card["id"]);
        i++;
      } else {
        let card = contents[i];
        content.innerHTML += /*html*/ `
      <div id='${card["id"]}' class="board-card" draggable="true" ondragstart='doSetData(event, ${card["id"]})'>
        <img draggable="false" ondragstart="e.preventDefault()" id="board-category" class="board-category">
        <div draggable="false" class="board-title">${card["title"]}</div>
        <div draggable="false" class="board-description">${card["description"]}</div> 
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
      <div  id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone big-zone"></div>`;
        getCategory(card["category"], card["id"]);
        getPriority(card["priority"], card["id"]);
        getAssigned(card["assigned"], card["id"]);
        getProgressBar(card["subtasks"], card["id"]);
      }
    });
  }
}

/**
 * Gets the board card
 * @param {Object} card
 * @returns html code
 */
function getBoardCard(card) {
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
  <div  id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone"></div>`;
}

/**
 * Get board category
 * @param {string} category - board category
 * @param {number} id - board id
 */
function getCategory(category, id) {
  const content = document.getElementById(`${id}`);
  const boardCategory = content.querySelector("#board-category");

  boardCategory.src = icons["categoryIcons"][category] || "";
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
      if (i < 3) {
        boardUser.innerHTML += /*html*/ `
        <div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}</div>`;
      }
      i++;
    });
    if (i > 3) {
      boardUser.innerHTML += /*html*/ `
      <div id="board-user" class="board-user" style="background-color:#2A3647">+${i - 3}</div>`;
    }
  }
}

/**
 * Gets the progress bar
 * @param {Object} subtasks
 * @param {number} id
 */
function getProgressBar(subtasks, id) {
  const content = document.getElementById(`${id}`);
  const progressBar = content.querySelector("#progress-bar");
  const progressBarLabel = content.querySelector('label[for="progress-bar"]');
  let process = 0;

  if (subtasks == "") subtasks = [];
  for (let i = 0; i < subtasks.length; i++) {
    if (subtasks[i]["checked"] == true) {
      process++;
    }
  }
  if (subtasks.length == 0) {
    const container = progressBar.closest(".board-progress-bar-container");
    container.classList.add("d-none");
  } else {
    progressBarLabel.textContent = `${process}/${subtasks.length} Subtasks`;
    progressBar.value = +(process / subtasks.length) * 100;
  }

  const subtaskList = document.querySelectorAll(".full-size-subtask-li");
}
