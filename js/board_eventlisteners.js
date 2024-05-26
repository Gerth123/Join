let id;
let contentId;

/**
 * Attaches event listeners to various elements on the page.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
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
  deleteFullSizeBoard();
  cancelAddCard(fullsize);
  searchCard();
}

/**
 * Attaches a click event listener to each category item. When a category item is clicked,
 * it selects the corresponding select button and updates its text content with the clicked
 * item's text content.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
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

/**
 * Attaches a click event listener to each category item. When a category item is clicked,
 * it selects the corresponding select button and updates its text content with the clicked
 * item's text content.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function onClickAddCategory() {
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectButton = document.querySelector("#select-btn-addCard");
      const btnText = document.querySelector(".category-addCard .btn-text-category");
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
 * @author Hanbit Chang
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
 * @author Hanbit Chang
 */
function onClickCloseFullSize(fullsize) {
  document.addEventListener("click", async (e) => {
    if (e.target.matches("#close-btn-img")) {
      fullsize.classList.add("d-none");
      let itemData = await getItemById(id, contentId);
      let subtasks = itemData["subtasks"];
      for (let i = 0; i < subtasks.length; i++) {
        const check = document.getElementById(`subtask-${i}`);
        if (check.checked) subtasks[i]["checked"] = true;
        if (!check.checked) subtasks[i]["checked"] = false;
      }
      await updateSubtaskCheck(subtasks);
      location.reload();
    }
    if (e.target.matches("#close-btn-img-add")) fullsize.classList.add("d-none");
  });
}

/**
 * Update the subtasks check and reload
 * @param {Object} subtasks
 * @author Hanbit Chang
 */
async function updateSubtaskCheck(subtasks) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let data = await getData("tasks");
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) {
          item["subtasks"] = subtasks;
        }
      }
    }
  }
  await putData(`users/${actualUsersNumber}/tasks/`, data);
}

/**
 * Onclick gets add-task board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 * @author Hanbit Chang
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

/**
 * Adds a small task button to the board and opens the full-size container.
 *
 * @param {number} contentIdAdd - The ID of the content to add.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function addTaskBtnSmall(contentIdAdd) {
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  contentId = contentIdAdd;
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
  onClickAddSubTasks();
  getAddAssgined();
}

/**
 * Retrieves the assigned users for a specific task and updates the add card form with their names.
 *
 * @return {Promise<void>} A Promise that resolves when the assigned users have been retrieved and the add card form has been updated.
 * @author Hanbit Chang
 */
async function getAddAssgined() {
  let data = await getData("tasks");
  let contacts = await getData("contacts");
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
  getAssignedUsersAddCard(assignedUsers, contacts);
}

/**
 * Generates the HTML list of contacts for the add card view, with checkboxes indicating which contacts are assigned.
 *
 * @param {Array} assignedUsers - An array of user names that are currently assigned to the task.
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getAssignedUsersAddCard(assignedUsers, contacts) {
  getAssignedItem(assignedUsers, contacts);
  assignedItemEventListener(contacts);
}

/**
 * Generates the HTML list of contacts for the add card view, with checkboxes indicating which contacts are assigned.
 *
 * @param {Array} assignedUsers - An array of user names that are currently assigned to the task.
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getAssignedItem(assignedUsers, contacts) {
  const contactList = document.getElementById("assigned-list-items-addCard");
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
}

/**
 * Attaches a click event listener to each assigned item and toggles the "checked" class on the item when clicked.
 * Calls the `checkedUsers` function with the `contacts` parameter.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function assignedItemEventListener(contacts) {
  const assignedItems = document.querySelectorAll(".assigned-item");
  assignedItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      checkedUsers(contacts);
    });
  });
}

/**
 * Updates the checked users list based on the selected contacts.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
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
      if (personWithName) checkedUsers.innerHTML += getAssignedUser(personWithName);
    });
  } else {
    btnText.innerText = "Select contacts to assign";
    checkedUsers.innerHTML = "";
  }
}

/**
 * Generates an HTML string representing an assigned user element with a background color and name.
 *
 * @param {Object} personWithName - An object containing a name and color property.
 * @return {string} An HTML string representing the assigned user element.
 * @author Hanbit Chang
 */
function getAssignedUser(personWithName) {
  let name = getInitials(personWithName["name"]);
  return /*html*/ `
    <div class="assigned-user">
      <div id="board-user" class="board-user-editCard" style="background-color: ${personWithName["color"]}">${name}</div>
    </div> `;
}

/**
 * Onclick gets edit board
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 * @author Hanbit Chang
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
 * @author Hanbit Chang
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
 * @author Hanbit Chang
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
 * Returns the HTML for a subtask list item with a task name and edit/trash buttons.
 *
 * @param {string} subtaskInputValue - The name of the task to display in the subtask list item.
 * @return {string} The HTML code for the subtask list item.
 * @author Hanbit Chang
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
 * Asynchronously saves the edited data by retrieving the "tasks" and "contacts" data from the server,
 * updating the items in the data array with the edited values, and then sending the updated data back to
 * the server. After the data is saved, the page is reloaded.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and the page is reloaded.
 * @author Hanbit Chang
 */
async function saveEditData() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let data = await getData("tasks");
  let contacts = await getData("contacts");
  for (let listItem of data) {
    if (listItem.id == contentId) {
      for (let item of listItem.items) {
        item = setEditItems(item, contacts);
        await putData(`users/${actualUsersNumber}/tasks/`, data);
      }
    }
  }
  location.reload();
}

/**
 * Updates the properties of the given item with the values from the edit form.
 *
 * @param {Object} item - The item to be updated.
 * @param {Array} contacts - The list of contacts.
 * @return {Object} The updated item.
 * @author Hanbit Chang
 */
function setEditItems(item, contacts) {
  const title = document.getElementById("title-editCard");
  const description = document.getElementById("description-editCard");
  const date = document.getElementById("date-editCard");
  if (item.id == id) {
    item.category = editCategory(item.category);
    item.title = title.value;
    item.description = description.value;
    item.date = date.value;
    item.priority = editPriorityValue();
    item.subtasks = editSubTasksValue(item.subtasks);
    item.assigned = editAssignedValue(contacts);
  }
  return item;
}

/**
 * Retrieves the assigned users from the DOM and returns their information.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {Array|string} An array of assigned user objects, each containing a color and name property. If no users are assigned, an empty string is returned.
 * @author Hanbit Chang
 */
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
  if (assigned.length == 0) return "";
  return assigned;
}

/**
 * Returns category in edit card
 * @param {string} category
 * @returns string
 * @author Hanbit Chang
 */
function editCategory(category) {
  const newCategory = document.querySelector(".btn-text-category");
  const stripped = newCategory.textContent.replace(/\s+/g, " ").trim();
  if (newCategory.textContent == "Select task category") return category;
  if (newCategory.textContent != "Select task category") return stripped;
}

/**
 * Returns priority
 * @returns string
 * @author Hanbit Chang
 */
function editPriorityValue() {
  const priority3 = document.getElementById("radio-btn-3");
  const priority2 = document.getElementById("radio-btn-2");
  const priority1 = document.getElementById("radio-btn-1");
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
 * @author Hanbit Chang
 */
function editSubTasksValue(subtasks) {
  const newSubtasks = document.querySelectorAll(".subtasks-li-text");
  if (subtasks == "") subtasks = [];
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
  if (subtasks == "") return "";
  return subtasks;
}

/**
 * Update checked
 * @param {Object} temp
 * @param {Object} Oldtask
 * @returns Object
 * @author Hanbit Chang
 */
function updateChecked(temp, Oldtask) {
  const updatedTemp = temp.map((item) => {
    const matchingTask = Oldtask.find((oldItem) => oldItem.task === item.task);
    return matchingTask ? { ...item, checked: matchingTask.checked } : item;
  });
  return updatedTemp;
}

/**
 * Adds event listeners to the subtask add button, container, and delete button.
 * When the add button is clicked, it hides the add button and shows the container.
 * When the delete button is clicked, it clears the value of the subtask input.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
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
 * Asynchronously saves the added data by retrieving the "tasks" and "contacts" data from the server,
 * adding a new object to the items array of the content with the specified id, and then sending the updated data back to
 * the server. After the data is saved, the page is reloaded.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and the page is reloaded.
 * @author Hanbit Chang
 */
async function saveAddData() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let data = await getData("tasks");
  let contacts = await getData("contacts");
  if (contentId == undefined) contentId = 1;
  const content = data.find((content) => content.id == contentId);
  console.log(content);
  const obj = getAddObj(contacts);
  if (content.items == "") content.items = [];
  content.items.push(obj);
  await putData(`users/${actualUsersNumber}/tasks/`, data);
  location.reload();
}

/**
 * Generates an object with the necessary properties for adding a new item to the board.
 *
 * @param {Array} contacts - The list of contacts.
 * @return {Object} The object containing the new item's properties.
 * @author Hanbit Chang
 */
function getAddObj(contacts) {
  const title = document.getElementById("title-addCard");
  const description = document.getElementById("description-addCard");
  const date = document.getElementById("date-addCard");
  const newId = Math.floor(Math.random() * 100000);
  const obj = {
    id: newId,
    category: addCategory(),
    title: title.value,
    description: description.value,
    assigned: addAssignedValue(contacts),
    date: date.value,
    priority: addPriorityValue(),
    subtasks: addSubTasks(),
  };
  return obj;
}

/**
 * Retrieves the assigned users from the DOM and returns their information.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {Array|string} An array of assigned user objects, each containing a color and name property. If no users are assigned, an empty string is returned.
 * @author Hanbit Chang
 */
function addAssignedValue(contacts) {
  const assignedUsers = document.querySelectorAll(".checked .item-text");
  let assigned = [];
  assignedUsers.forEach((assignedUser) => {
    for (let contact of contacts) {
      if (contact.name == assignedUser.textContent) {
        assigned.push({
          color: contact["color"],
          name: contact["name"],
        });
      }
    }
  });
  if (assigned.length == 0) return "";
  return assigned;
}

/**
 * Retrieves the text content of the element with the class "btn-text-category"
 * and removes any leading or trailing whitespace.
 *
 * @return {string} The text content of the element with the class "btn-text-category".
 * @author Hanbit Chang
 */
function addCategory() {
  let newCategory = document.querySelector(".btn-text-category");
  const stripped = newCategory.textContent.replace(/\s+/g, " ").trim();
  return stripped;
}

/**
 * Returns the priority value based on the selected radio button.
 *
 * @return {string} The priority value: "urgent", "medium", or "low".
 * @author Hanbit Chang
 */
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
 * Retrieves all the subtasks from the DOM and returns an array of objects representing each subtask.
 *
 * @return {Array<Object>} An array of objects, each representing a subtask. Each object has two properties:
 *                          - `checked`: a boolean indicating whether the subtask is checked or not.
 *                          - `task`: a string representing the text content of the subtask.
 * @throws {string} Returns an empty string if there are no subtasks.
 * @author Hanbit Chang
 */
function addSubTasks() {
  let newSubtasks = document.querySelectorAll(".subtasks-li-text");
  let temp = [];
  newSubtasks.forEach((task) => {
    temp.push({ checked: false, task: task.textContent });
  });

  if (temp.length == 0) return "";
  return temp;
}

/**
 * Deletes a full-size board when the user clicks on the delete button.
 *
 * @return {Promise<void>} A promise that resolves when the board is deleted and the page is reloaded.
 * @author Hanbit Chang
 */
function deleteFullSizeBoard() {
  document.addEventListener("click", async (e) => {
    let data = await getData("tasks");
    if (e.target.matches(".full-size-button-delete")) {
      let urlParams = new URLSearchParams(window.location.search);
      let actualUsersNumber = urlParams.get("actualUsersNumber");
      for (let column of data) {
        if (column.items == "") column.items = [];
        let item = column.items.find((item) => item.id == id);
        if (item) column.items.splice(column.items.indexOf(item), 1);
        if (column.items.length == 0) column.items = "";
      }
      await putData(`users/${actualUsersNumber}/tasks/`, data);
      location.reload();
    }
  });
}

/**
 * Attaches a click event listener to the cancel button and hides the fullsize element when clicked.
 *
 * @param {HTMLElement} fullsize - The fullsize element to be hidden.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function cancelAddCard(fullsize) {
  const cancel = document.querySelector(".cancel-button");
  cancel.addEventListener("click", () => {
    fullsize.classList.add("d-none");
  });
}

/**
 * Attaches a keydown event listener to the search input element and performs a search on the board cards.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function searchCard() {
  const search = document.getElementById("board-header-search-input");
  const boardCards = document.querySelectorAll(".board-card");
  search.addEventListener("keydown", () => {
    let serachValue = search.value.toLowerCase();
    if (search.value.length > 1) {
      boardCards.forEach((boardCard) => {
        let title = boardCard.querySelector(".board-title");
        let titleValue = title.innerHTML.toLowerCase();
        if (!titleValue.includes(serachValue)) {
          boardCard.classList.add("d-none");
        }
      });
    } else {
      boardCards.forEach((boardCard) => {
        boardCard.classList.remove("d-none");
      });
    }
  });
}
