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
  onClickEditCategory();
  onClickAddCategory();
}

function onClickEditCategory() {
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectButton = document.querySelector("#select-btn-editCard");
      const btnText = document.querySelector(".btn-text-category");
      if (selectButton) {
        selectButton.classList.remove("open");
        btnText.textContent = item.textContent;
      }
    });
  });
}

function onClickAddCategory() {
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectButton = document.querySelector("#select-btn-addCard");
      const btnText = document.querySelector(".category-addCard .btn-text-category");
      // console.log(btnText);
      if (selectButton) {
        selectButton.classList.remove("open");
        btnText.textContent = item.textContent;
      }
    });
  });
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
  document.addEventListener("click", async (e) => {
    if (e.target.matches("#close-btn-img")) {
      fullsize.classList.add("d-none");

      let itemData = await getItemById(id, contentId);
      let subtasks = itemData["subtasks"];
      for (let i = 0; i < subtasks.length; i++) {
        let check = document.getElementById(`subtask-${i}`);
        if (check.checked) {
          subtasks[i]["checked"] = true;
        } else {
          subtasks[i]["checked"] = false;
        }
      }
      await updateSubtaskCheck(subtasks);
      location.reload();
    }

    if (e.target.matches("#close-btn-img-add")) {
      fullsize.classList.add("d-none");
    }
  });
}

/**
 * Update the subtasks check and reload
 * @param {Object} subtasks
 */
async function updateSubtaskCheck(subtasks) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  // console.log("fulldata", fulldata[actualUsersNumber]["tasks"]);
  const data = fulldata[actualUsersNumber]["tasks"];
  // let data = read();
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) {
          item["subtasks"] = subtasks;
        }
      }
    }
  }
  // console.log("subtasks", subtasks);
  // console.log("data", data);
  //save(data)
  await putData(`users/${actualUsersNumber}/tasks/`, data);
}

/**
 * Onclick gets add-task board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickAddTaskBoard(fullsize, board, editBoard, addBoard) {
  const selectBtns = document.querySelectorAll("#select-btn-addCard");
  selectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("open");
    });
  });
  const addTaskBtn = document.getElementById("board-header-add-btn");
  addTaskBtn.addEventListener("click", () => {
    fullsize.classList.remove("d-none");
    board.classList.add("d-none");
    editBoard.classList.add("d-none");
    addBoard.classList.remove("d-none");
    contentId = 1;
    onClickAddSubTasks();
    getAddAssgined();
  });
}

function addTaskBtnSmall(contentIdAdd) {
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  // console.log(contentIdAdd);
  contentId = contentIdAdd;
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
  onClickAddSubTasks();
  getAddAssgined();
}

async function getAddAssgined() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");

  let contacts = fulldata[actualUsersNumber]["contacts"];
  let data = fulldata[actualUsersNumber]["tasks"];

  let assignedUsers = [];
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) {
          for (i = 0; i < item["assigned"].length; i++) {
            assignedUsers.push(item["assigned"][i]["name"]);
          }
        }
      }
    }
  }
  // console.log(contactList);
  let contactList = document.getElementById("assigned-list-items-addCard");
  contactList.innerHTML = "";
  contacts.forEach((contact) => {
    let name = getInitials(contact["name"]);
    contactList.innerHTML += /*html*/ `
        <li class="assigned-item ${getCheckedUsers(assignedUsers, contact["name"])}">
          <div class="assigned-user">
            <div id="board-user" class="board-user" style="background-color:${contact["color"]}">${name}</div>
            <span class="item-text">${contact["name"]}</span>
          </div>
          <div class="check-img"></div>
        </li>`;
  });

  const assignedItems = document.querySelectorAll(".assigned-item");
  assignedItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      checkedUsers(contacts);
    });
  });
}

function checkedUsers(contacts) {
  const checked = document.querySelectorAll(".checked");
  const btnText = document.querySelector(".btn-text-addCard");
  const checkedUsers = document.getElementById("assigned-users-addCard");
  const userNames = document.querySelectorAll(".checked .item-text");
  if (checked && checked.length > 0) {
    btnText.innerText = `${checked.length} Selected`;
    checkedUsers.innerHTML = "";
    userNames.forEach((userName) => {
      const personWithName = contacts.find((person) => person.name == userName.innerHTML);
      if (personWithName) {
        let name = getInitials(personWithName["name"]);
        checkedUsers.innerHTML += /*html*/ `
        <div class="assigned-user">
          <div id="board-user" class="board-user-editCard" style="background-color: ${personWithName["color"]}">${name}</div>
        </div>
        `;
      }
    });
  } else {
    btnText.innerText = "Select contacts to assign";
    checkedUsers.innerHTML = "";
  }
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
async function saveEditData() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  // console.log("fulldata", fulldata[actualUsersNumber]["tasks"]);
  const data = fulldata[actualUsersNumber]["tasks"];
  // let data = read();
  let title = document.getElementById("title-editCard");
  let description = document.getElementById("description-editCard");
  let date = document.getElementById("date-editCard");

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
          item.assigned = editAssignedValue(fulldata[actualUsersNumber]["contacts"]);
        }

        // console.log("saving data", data);
        // save(data);
        // console.log(`users/${actualUsersNumber}/tasks/`);
        await putData(`users/${actualUsersNumber}/tasks/`, data);
      }
    }
  }
}

function editAssignedValue(contacts) {
  const assignedUsers = document.querySelectorAll(".checked .item-text");
  let assigned = [];
  assignedUsers.forEach((assignedUser) => {
    for (const contact of contacts) {
      if (contact.name == assignedUser.textContent) {
        assigned.push({
          color: contact["color"],
          name: contact["name"],
        });
      }
    }
  });

  if (assigned.length == 0) {
    return "";
  }
  return assigned;
}

/**
 * Returns category in edit card
 * @param {string} category
 * @returns string
 */
function editCategory(category) {
  let newCategory = document.querySelector(".btn-text-category");
  // console.log(category);
  const stripped = newCategory.textContent.replace(/\s+/g, " ").trim();
  if (newCategory.textContent == "Select task category") {
    return category;
  } else {
    return stripped;
  }
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

/**
 * Returns Subtasks value
 * @param {Object} subtasks
 * @returns Object
 */
function editSubTasksValue(subtasks) {
  let newSubtasks = document.querySelectorAll(".subtasks-li-text");
  if (subtasks == "") {
    subtasks = [];
  }
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
  // console.log("subtasks", subtasks == "");
  if (subtasks == "") {
    return "";
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
 *
 */
async function saveAddData() {
  const title = document.getElementById("title-addCard");
  const description = document.getElementById("description-addCard");
  const date = document.getElementById("date-addCard");
  // console.log(date);
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  // console.log("fulldata", fulldata[actualUsersNumber]["tasks"]);
  const data = fulldata[actualUsersNumber]["tasks"];
  // let data = read();
  const content = data.find((content) => content.id == contentId);
  const newId = Math.floor(Math.random() * 100000);
  const obj = {
    id: newId,
    category: addCategory(),
    title: title.value,
    description: description.value,
    assigned: addAssignedValue(fulldata[actualUsersNumber]["contacts"]),
    date: date.value,
    priority: addPriorityValue(),
    subtasks: await addSubTasks(),
  };
  id = newId;
  if (content.items == "") {
    content.items = [];
  }
  // console.log(id, contentId);
  content.items.push(obj);
  // save(data);
  // console.log("saving", data);
  await putData(`users/${actualUsersNumber}/tasks/`, data);
}

function addAssignedValue(contacts) {
  const assignedUsers = document.querySelectorAll(".checked .item-text");
  let assigned = [];
  assignedUsers.forEach((assignedUser) => {
    for (const contact of contacts) {
      if (contact.name == assignedUser.textContent) {
        assigned.push({
          color: contact["color"],
          name: contact["name"],
        });
      }
    }
  });

  if (assigned.length == 0) {
    return "";
  }
  return assigned;
}

function addCategory() {
  let newCategory = document.querySelector(".btn-text-category");
  const stripped = newCategory.textContent.replace(/\s+/g, " ").trim();
  return stripped;
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

function addSubTasks() {
  let newSubtasks = document.querySelectorAll(".subtasks-li-text");
  let temp = [];
  newSubtasks.forEach((task) => {
    temp.push({ checked: false, task: task.textContent });
  });

  if (temp.length == 0) {
    return "";
  }
  return temp;
}
