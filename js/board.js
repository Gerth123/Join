const addTaskBtn = document.getElementById("board-header-add-btn");
const editBtn = document.getElementById("edit-btn");

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
  {
    id: 1,
    items: [
      {
        id: 9237,
        category: "user story",
        title: "Contactform & Print",
        description: "Build start page with recipe recommenation I would like to change this",
        assigned: [
          { name: "Hanbit", lastName: "Chang" },
          { name: "Hanbit", lastName: "Chang" },
        ],
        date: "12/3/1992",
        priority: "medium",
        subtasks: [
          { checked: false, task: "contact form" },
          { checked: true, task: "Hello" },
        ],
      },
      {
        id: 7237,
        category: "technical task",
        title:
          "Contactform & Print and other stuffs check how it is, how long does this keep going. Contactform & Print and other stuffs check how it is, how long does this keep going",
        description:
          "Build start page with recipe recommenation I would like to change this Contactform & Print and other stuffs check how it is, how long does this keep goingContactform & Print and other stuffs check how it is, how long does this keep going",
        assigned: [
          { name: "Hanbit", lastName: "Chang" },
          { name: "Robin", lastName: "Mark" },
          { name: "Robin", lastName: "Mark" },
          { name: "Robin", lastName: "Mark" },
          { name: "Robin", lastName: "Mark" },
        ],
        date: "12/3/3992",
        priority: "low",
        subtasks: [
          { checked: false, task: "this is checkbox" },
          { checked: true, task: "checkbox" },
        ],
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        id: 19237,
        category: "user story",
        title: "Hanbit chang is cool",
        description: "welcome",
        assigned: [],
        date: "12/3/2092",
        priority: "urgent",
        subtasks: [
          { checked: false, task: "contact dfd form" },
          { checked: false, task: "Hello" },
        ],
      },
    ],
  },
  { id: 3, items: [] },
  { id: 4, items: [] },
];

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
  let date = document.querySelector(".full-size-date");
  title.textContent = `${itemData["title"]}`;
  description.textContent = `${itemData["description"]}`;
  date.textContent = `${itemData["date"]}`;
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
  let fullSizeAssigned = document.querySelector(".full-size-assign");

  assigned.forEach((user) => {
    console.log(user);
    fullSizeAssigned.innerHTML += /*html*/ `
    <div class="full-size-assign-user">
      ${user["name"]} ${user["lastName"]}  
    </div>`;
  });
}

function getFullSizeSubtask(subtasks) {
  let fullSizeSubtasks = document.getElementById("full-size-subtasks");

  for (let i = 0; i < subtasks.length; i++) {
    fullSizeSubtasks.innerHTML += /*html*/ `
    <input type="checkbox" id="subtask-${i}">
    <label for="subtask-${i}">${subtasks[i]["task"]}</label>
    `;
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
