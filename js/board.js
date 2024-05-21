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

let icons;
let emptyData;
///////////////////Render Boards//////////////////////
/**
 * On loading it inits the elements
 */
async function init() {
  emptyData = await getExampleData();
  icons = await getIcons();
  await renderBoards();
  // save(emptyData);
  getEventListeners();
  getDropZones();
}

/**
 * Renders the board
 */
async function renderBoards() {
  let urlParams = new URLSearchParams(window.location.search);

  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  const data = fulldata[actualUsersNumber]["tasks"];

  getBoardSection(data);
}

/**
 * Gets the item by id
 * @param {number} id
 * @param {number} contentId
 * @returns item data
 */
async function getItemById(id, contentId) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  const data = fulldata[actualUsersNumber]["tasks"];
  const itemList = data.find((items) => items["id"] == contentId);
  const item = itemList["items"].find((items) => items["id"] == id);
  return item;
}

/**
 * Gets the board
 * @param {Object} data
 */
function getBoardSection(data) {
  const boardSection = document.getElementById("board-card-section");
  boardSection.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const id = data[i]["id"];
    boardSection.innerHTML += getBoardContainer(id);
    getBoardContents(data[i]["items"], id);
  }
}

/**
 * Gets the board container
 * @param {number} id
 * @returns html code
 */
function getBoardContainer(id) {
  return /*html*/ ` 
    <div id="${id}" class="board-card-content">
      <div id="dropzone" ondragover="allowDrop(event)" ondrop="doDrop(event)" class="board-card-dropzone"></div>
    </div>`;
}

/**
 * Gets the board contents
 * @param {Object} contents
 * @param {number} id
 */
function getBoardContents(contents, id) {
  let content = document.getElementById(`${id}`);
  if (contents != "") {
    contents.forEach(function (card) {
      content.innerHTML += getBoardCard(card);
      getCategory(card["category"], card["id"]);
      getPriority(card["priority"], card["id"]);
      getAssigned(card["assigned"], card["id"]);
      getProgressBar(card["subtasks"], card["id"]);
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
  let boardUser = content.querySelector("#board-users");
  if (assigned != "") {
    assigned.forEach((user) => {
      let name = getInitials(user["name"]);
      // let name = Array.from(`${user["name"]}`)[0];
      // let lastName = Array.from(`${user["lastName"]}`)[0];
      boardUser.innerHTML += /*html*/ `
      <div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}</div>`;
    });
  }
}

/**
 * Gets the progress bar
 * @param {Object} subtasks
 * @param {number} id
 */
function getProgressBar(subtasks, id) {
  let content = document.getElementById(`${id}`);
  let progressBar = content.querySelector("#progress-bar");
  let progressBarLabel = content.querySelector('label[for="progress-bar"]');
  let process = 0;
  if (subtasks == "") {
    subtasks = [];
  }
  for (let i = 0; i < subtasks.length; i++) {
    if (subtasks[i]["checked"] == true) {
      process++;
    }
  }
  if (subtasks.length == 0) {
    let container = progressBar.closest(".board-progress-bar-container");
    container.classList.add("d-none");
  } else {
    progressBarLabel.textContent = `${process}/${subtasks.length} Subtasks`;
    progressBar.value = +(process / subtasks.length) * 100;
  }
}
