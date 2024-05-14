let id;
let contentId;

/**
 * EventListeners are listed in this function
 */
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

/**
 * Onclick gets the full-size board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickFullSizeBoard(fullsize, board, editBoard, addBoard) {
  const boardCard = document.querySelectorAll(".board-card");
  boardCard.forEach((card) =>
    card.addEventListener("click", () => {
      fullsize.classList.remove("d-none");
      board.classList.remove("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.add("d-none");
      id = card.id;
      contentId = card.parentNode.id;
      getFullSizeBoard(id, contentId);
    })
  );
}

/**
 * Onclick closes the full-size
 * @param {Element} fullsize
 */
function onClickCloseFullSize(fullsize) {
  document.addEventListener("click", (e) => {
    if (e.target.matches("#close-btn-img")) {
      fullsize.classList.add("d-none");
      let itemData = getItemById(id, contentId);
      let subtasks = itemData["subtasks"];
      for (let i = 0; i < subtasks.length; i++) {
        let check = document.getElementById(`subtask-${i}`);
        if (check.checked) {
          subtasks[i]["checked"] = true;
        } else {
          subtasks[i]["checked"] = false;
        }
      }
      updateSubtaskCheck(subtasks);
      location.reload();
    }
  });
}

/**
 * Update the subtasks check and reload
 * @param {Object} subtasks
 */
function updateSubtaskCheck(subtasks) {
  let data = read();
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) {
          item["subtasks"] = subtasks;
        }
      }
    }
  }
  save(data);
}

/**
 * Onclick gets add-task board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickAddTaskBoard(fullsize, board, editBoard, addBoard) {
  const addTaskBtn = document.getElementById("board-header-add-btn");
  addTaskBtn.addEventListener("click", () => {
    fullsize.classList.remove("d-none");
    board.classList.add("d-none");
    editBoard.classList.add("d-none");
    addBoard.classList.remove("d-none");
    contentId = 1;
    onClickAddSubTasks();
  });
}

function addTaskBtnSmall(contentIdAdd) {
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  console.log(contentIdAdd);
  contentId = contentIdAdd;
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
  onClickAddSubTasks();
}

/**
 * Onclick gets edit board
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickEditBoard(board, editBoard, addBoard) {
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", () => {
    board.classList.add("d-none");
    editBoard.classList.remove("d-none");
    addBoard.classList.add("d-none");
    getEditBoard(id, contentId);
    onClickEditSubtasks();
  });
}

/**
 * Onclick subtasks are modified
 */
function onClickEditSubtasks() {
  const subtaskAddBtn = document.getElementById("subtasks-add");
  const subtaskContainer = document.getElementById("subtasks-btn-container");
  const subtaskDelBtn = document.getElementById("subtasks-del");
  const subtaskInput = document.getElementById("subtasks-input");

  subtaskAddBtn.addEventListener("click", () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  });

  subtaskDelBtn.addEventListener("click", () => {
    subtaskInput.value = "";
  });
}

function onClickAddSubTasks() {
  const subtaskAddBtn = document.getElementById("subtasks-add-addCard");
  const subtaskContainer = document.getElementById("subtasks-btn-container-addCard");
  const subtaskDelBtn = document.getElementById("subtasks-del-addCard");
  const subtaskInput = document.getElementById("subtasks-input-addCard");

  subtaskAddBtn.addEventListener("click", () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  });

  subtaskDelBtn.addEventListener("click", () => {
    subtaskInput.value = "";
  });
}

/**
 * Checks the subtasks
 */
function checkEditSubtasks() {
  const list = document.getElementById("subtasks-list");
  const subtaskInput = document.getElementById("subtasks-input");
  const subtaskAddBtn = document.getElementById("subtasks-add");
  const subtaskContainer = document.getElementById("subtasks-btn-container");
  list.innerHTML += getSubtaskListHTML(subtaskInput.value);
  subtaskInput.value = "";
  subtaskContainer.classList.add("d-none");
  subtaskAddBtn.classList.remove("d-none");
  getSubtasksEventListeners();
}

/**
 * Returns the html of subtask list
 * @param {string} subtaskInputValue
 * @returns html code
 */
function getSubtaskListHTML(subtaskInputValue) {
  return /*html*/ `
  <li id="subtasks-li">
    <div class="subtasks-li-container">
      <p class="subtasks-li-text" contenteditable=false>${subtaskInputValue}</p>
      <div class="row" id="subtask-first-btns">
        <img class="subtasks-btn-none" id="subtasks-edit" src="/assets/icons/board/edit/edit_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
      </div>
      <div class="row d-none" id="subtask-second-btns">
        <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-checker" src="./assets/icons/board/edit/check_button.svg" alt="" />
      </div> 
    </div>
  </li>`;
}

/**
 *  save edit data
 */
function saveEditData() {
  let data = read();
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");

  for (const listItem of data) {
    if (listItem.id == contentId) {
      for (let item of listItem.items) {
        if (item.id == id) {
          item.category = editCategory(item.category);
          item.title = title.value;
          item.description = description.value;
          item.date = date.value;
          item.priority = editPriorityValue();
          item.subtasks = editSubTasksValue(item.subtasks);
        }
        save(data);
      }
    }
  }
}

/**
 *
 */
function saveAddData() {
  const title = document.getElementById("title-addCard");
  const description = document.getElementById("description-addCard");
  const date = document.getElementById("date-addCard");
  console.log(date);
  let data = read();
  const content = data.find((content) => content.id == contentId);
  const newId = Math.floor(Math.random() * 100000);
  const obj = {
    id: newId,
    category: addCategory(),
    title: title.value,
    description: description.value,
    assigned: [],
    date: date.value,
    priority: addPriorityValue(),
    subtasks: [],
  };
  id = newId;

  console.log(id, contentId);
  content.items.push(obj);
  save(data);
}

/**
 * Returns category in edit card
 * @param {string} category
 * @returns string
 */
function editCategory(category) {
  let newCategory = document.getElementById("category");
  if (newCategory.value == "") {
    return category;
  } else {
    return newCategory.value;
  }
}

function addCategory() {
  let newCategory = document.getElementById("category-addCard");
  return newCategory.value;
}

/**
 * Returns priority
 * @returns string
 */
function editPriorityValue() {
  let priority3 = document.getElementById("radio-btn-3");
  let priority2 = document.getElementById("radio-btn-2");
  let priority1 = document.getElementById("radio-btn-1");
  if (priority3.checked) {
    return "urgent";
  } else if (priority2.checked) {
    return "medium";
  } else if (priority1.checked) {
    return "low";
  }
}

function addPriorityValue() {
  let priority6 = document.getElementById("radio-btn-6");
  let priority5 = document.getElementById("radio-btn-5");
  let priority4 = document.getElementById("radio-btn-4");
  if (priority6.checked) {
    return "urgent";
  } else if (priority5.checked) {
    return "medium";
  } else if (priority4.checked) {
    return "low";
  }
}

/**
 * Returns Subtasks value
 * @param {Object} subtasks
 * @returns Object
 */
function editSubTasksValue(subtasks) {
  let newSubtasks = document.querySelectorAll(".subtasks-li-text");
  if (subtasks.length < newSubtasks.length) {
    for (let i = subtasks.length; i < newSubtasks.length; i++) {
      subtasks.push({ checked: false, task: newSubtasks[i].innerHTML });
    }
  } else if (subtasks.length >= newSubtasks.length) {
    let temp = [];
    newSubtasks.forEach((task) => {
      temp.push({ checked: false, task: task.textContent });
    });
    let updatedSubtask = (updatedTemp = updateChecked(temp.slice(), subtasks));
    subtasks = updatedSubtask;
  }
  return subtasks;
}

/**
 * Update checked
 * @param {Object} temp
 * @param {Object} Oldtask
 * @returns Object
 */
function updateChecked(temp, Oldtask) {
  const updatedTemp = temp.map((item) => {
    const matchingTask = Oldtask.find((oldItem) => oldItem.task === item.task);
    return matchingTask ? { ...item, checked: matchingTask.checked } : item;
  });
  return updatedTemp;
}
