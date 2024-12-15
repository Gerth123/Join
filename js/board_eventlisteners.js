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
  getEditEventListeners(board, editBoard, addBoard);
  deleteFullSizeBoard();
  cancelAddCard(fullsize);
  onClickSelectBtn();
  searchCard();
}

function onClickSelectBtn() {
  const selectBtns = document.querySelectorAll("#select-btn-addCard");
  selectBtns.forEach((btn) => {
    btn.onclick = () => {
      btn.classList.toggle("open");
    };
  });

  document.onclick = function (event) {
    if (!event.target.closest("#select-btn-addCard") && !event.target.closest(".assigned-item")) {
      selectBtns.forEach((btns) => {
        btns.classList.remove("open");
      });
    }
  };
}

/**
 * Update the subtasks check and reload
 * @param {Object} subtasks
 * @author Hanbit Chang
 */
async function updateSubtaskCheck(subtasks) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) item["subtasks"] = subtasks;
      }
    }
  }
  await putData(`users/${actualUsersNumber}/tasks/`, data);
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
      <li class="assigned-item">
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
    item.onclick = () => {
      item.classList.toggle("checked");
      checkedUsers(contacts);
    };
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
    let i = 0;
    userNames.forEach((userName) => {
      const personWithName = contacts.find((person) => person.name == userName.innerHTML);
      if (personWithName) {
        if (i < 3) checkedUsers.innerHTML += getAssignedUser(personWithName);
        i++;
      }
    });
    checkedUsersConditionOverFlowed(i, checkedUsers);
  } else emptyCheckedUsersAddCard();
}

/**
 * Empties the checked users list and updates the UI for the add card feature.
 *
 * @return {void} This function does not return anything.
 */
function emptyCheckedUsersAddCard() {
  const btnText = document.querySelector(".btn-text-addCard");
  const checkedUsers = document.getElementById("assigned-users-addCard");
  btnText.innerText = "Select contacts to assign";
  checkedUsers.innerHTML = "";
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
 * Returns the HTML for a subtask list item with a task name and edit/trash buttons.
 *
 * @param {string} subtaskInputValue - The name of the task to display in the subtask list item.
 * @return {string} The HTML code for the subtask list item.
 * @author Hanbit Chang
 */
function getSubtaskListHTML(subtaskInputValue) {
  return /*html*/ `
  <li id="subtasks-li" class="subtasks-li-content">
    <div class="subtasks-li-container">
      <p class="subtasks-li-text" contenteditable=false>${subtaskInputValue}</p>
      <div class="subtasks-row" id="subtask-first-btns">
        <img class="subtasks-btn-none" id="subtasks-edit" src="/assets/icons/board/edit/edit_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
      </div>
      <div class="subtasks-row d-none" id="subtask-second-btns">
        <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-checker" src="./assets/icons/board/edit/check_button.svg" alt="" />
      </div> 
    </div>
  </li>`;
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

  subtaskAddBtn.onclick = () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  };

  subtaskDelBtn.onclick = () => {
    subtaskInput.value = "";
  };
}

/**
 * Clears the input fields and reset the state of the add task form.
 *
 * @return {void} This function does not return anything.
 */
function clearAddTaskInputs() {
  const title = document.getElementById("title-addCard");
  const description = document.getElementById("description-addCard");
  const date = document.getElementById("date-addCard");
  const categories = document.getElementById("add-task-categories");
  const subtasksInput = document.getElementById("subtasks-input-addCard");
  const subtasks = document.getElementById("subtasks-list-addCard");

  title.value = "";
  description.value = "";
  date.value = "";
  categories.value = "";
  subtasksInput.value = "";
  subtasks.innerHTML = "";
}

/**
 * Resets the assigned users in the add task form by removing the "checked" class from all assigned items,
 * clearing the assigned users container, and updating the assigned button text to "Select contacts to assign".
 *
 * @return {void} This function does not return anything.
 */
function setAssignedAddTask() {
  const assignedUsers = document.getElementById("assigned-users-addCard");
  const assignedItems = document.querySelectorAll(".assigned-item");
  const assignedBtnText = document.querySelector(".btn-text-addCard");

  assignedItems.forEach((item) => {
    item.classList.remove("checked");
  });
  assignedUsers.innerHTML = "";
  assignedBtnText.innerHTML = "Select contacts to assign";
}

/**
 * Sets the initial state of the checkboxes for the priority buttons.
 *
 * This function finds the first, remove, and remove2 checkboxes by their IDs
 * and sets their checked state. The first checkbox is checked, while the
 * remove and remove2 checkboxes are unchecked.
 *
 * @return {void} This function does not return anything.
 */
function setCheckBoxes() {
  const firstCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-5"]');
  const removeCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-6"]');
  const removeCheckedBox2 = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-4"]');
  firstCheckedBox.checked = true;
  removeCheckedBox.checked = false;
  removeCheckedBox2.checked = false;
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
      if (contact != null) {
        if (contact.name == assignedUser.textContent) {
          assigned.push({ color: contact["color"], name: contact["name"] });
        }
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
  const newCategory = document.getElementById("add-task-categories");
  return newCategory.value;
}

/**
 * Returns the priority value based on the selected radio button.
 *
 * @return {string} The priority value: "urgent", "medium", or "low".
 * @author Hanbit Chang
 */
function addPriorityValue() {
  const priority6 = document.getElementById("radio-btn-6");
  const priority5 = document.getElementById("radio-btn-5");
  const priority4 = document.getElementById("radio-btn-4");
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
  const newSubtasks = document.querySelectorAll(".subtasks-li-text");
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
  const delBtn = document.querySelector(".full-size-button-delete");
  delBtn.onclick = async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let actualUsersNumber = urlParams.get("actualUsersNumber");
    for (let column of data) {
      if (column.items == "") column.items = [];
      let item = column.items.find((item) => item.id == id);
      if (item) column.items.splice(column.items.indexOf(item), 1);
      if (column.items.length == 0) column.items = "";
    }
    await deleteRender(actualUsersNumber);
  };
}

/**
 * Asynchronously renders boards, sets up event listeners, sets up drop zones,
 * hides the full-size container, and puts data to the server.
 *
 * @return {Promise<void>} A promise that resolves when the rendering, event
 * listeners, drop zones, and full-size container hiding are complete, and the
 * data is put to the server.
 */
async function deleteRender(actualUsersNumber) {
  renderBoards(data);
  getEventListeners();
  getDropZones();
  const fullSize = document.getElementById("full-size-container");
  fullSize.classList.add("d-none");
  await putData(`users/${actualUsersNumber}/tasks/`, data);
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
  cancel.onclick = () => {
    fullsize.classList.add("d-none");
    clearAddTaskInputs();
    setCheckBoxes();
    setAssignedAddTask();
  };
}

function closeMenus() {
  const fullSizeContainer = document.getElementById('full-size-container');
  fullSizeContainer.classList.add('d-none');  
}
