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
  {
    id: 1,
    items: [
      {
        id: 9237,
        category: "user story",
        title: "Contactform & Print",
        description: "Build start page with recipe recommenation I would like to change this",
        assigned: { name: "Hanbit", lastName: "Chang" },
        date: "12/3/1992",
        priority: "medium",
        subtasks: ["contact form"],
      },
      {
        id: 7237,
        category: "technical task",
        title: "Contactform & Print and other stuffs check how it is, how long does this keep going",
        description: "Build start page with recipe recommenation I would like to change this",
        assigned: { name: "Robin", lastName: "Mark" },
        date: "12/3/1992",
        priority: "low",
        subtasks: ["contact form"],
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
        assigned: { name: "Hanbit", lastName: "Chang" },
        date: "12/3/1992",
        priority: "urgent",
        subtasks: ["contact form"],
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

const priorityIcons = {
  low: "/assets/icons/board/priority/low.svg",
  medium: "/assets/icons/board/priority/medium.svg",
  urgent: "/assets/icons/board/priority/urgent.svg",
};

///////////////////Render Boards//////////////////////
/**
 * On loading the site the function triggers
 * @author Hanbit Chang
 */
async function init() {
  await renderBoards();
  save(emptyData);
}

async function renderBoards() {
  let data = read();
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
            <div class="board-user">HC</div>
            <div class="board-user">RB</div>
          </div>
          <img id='board-priority' alt="">
        </div>
        <div  id="dropzone" class="kanban-dropzone"></div>
      </div>
    `;
    getCategory(card["category"], card["id"]);
    getPriority(card["priority"], card["id"]);
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
