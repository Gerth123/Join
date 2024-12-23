/**
 * Asynchronously retrieves the data of a specific board item and updates the edit form with its values.
 *
 * @param {string} id - The ID of the board item to retrieve.
 * @param {string} contentId - The ID of the content to which the board item belongs.
 * @return {Promise<void>} A Promise that resolves when the edit form has been updated.
 * @author Hanbit Chang
 */
async function getEditBoard(id, contentId) {
  const title = document.querySelector("input[id=title-editCard]");
  const description = document.querySelector("textarea[id=description-editCard]");
  const date = document.querySelector("input[id=date-editCard]");
  let itemData = await getItemById(id);
  title.value = `${itemData["title"]}`;
  description.value = `${itemData["description"]}`;
  date.value = `${itemData["date"]}`;
  toggleSelectBtn();
  oneCheckBoxEdit();
  getEditPriority(itemData["priority"]);
  getEditSubtasks(itemData["subtasks"]);
  await getEditAssigned();
  getSubtasksEventListeners();
  getEditDate(itemData["date"]);
}

function oneCheckBoxEdit() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="priority-button"]');
  checkboxes.forEach((checkbox) => {
    checkbox.onchange = function () {
      if (this.checked) {
        checkboxes.forEach((box) => {
          if (box !== this) box.checked = false;
        });
      }
    };
  });
}

/**
 * Toggles the "open" class on the select buttons with the ID "select-btn-editCard" when clicked.
 *
 * @author Hanbit Chang
 */
function toggleSelectBtn() {
  const selectBtns = document.querySelectorAll("#select-btn-editCard");
  selectBtns.forEach((btn) => {
    btn.onclick = function () {
      btn.classList.toggle("open");
    };
  });
  document.onclick = function (event) {
    if (!event.target.closest("#select-btn-editCard") && !event.target.closest(".assigned-item")) {
      selectBtns.forEach((btn) => {
        btn.classList.remove("open");
      });
    }
  };
}

/**
 * Sets the checked state of the corresponding radio button based on the given priority.
 *
 * @param {string} priority - The priority value to set the radio button for.
 * @author Hanbit Chang
 */
function getEditPriority(priority) {
  if (priority == "urgent") {
    let urgentBtn = document.querySelector("#radio-btn-3");
    urgentBtn.checked = true;
  }
  if (priority == "medium") {
    let mediumBtn = document.querySelector("#radio-btn-2");
    mediumBtn.checked = true;
  }
  if (priority == "low") {
    let lowBtn = document.querySelector("#radio-btn-1");
    lowBtn.checked = true;
  }
}

/**
 * Checks if the given contact name is present in the array of assigned users.
 *
 * @param {Array} assignedUsers - The array of assigned user names.
 * @param {string} contactName - The name of the contact to check.
 * @return {string} - The string "checked" if the contact name is found in the array, otherwise an empty string.
 * @author Hanbit Chang
 */
function getCheckedUsers(assignedUsers, contactName) {
  if (!Array.isArray(assignedUsers) || assignedUsers.length === 0) return "";
  for (const userName of assignedUsers) {
    if (userName === contactName) {
      return "checked";
    }
  }
  return "";
}


/**
 * Retrieves the assigned users for a specific task and updates the edit form with their names.
 *
 * @author Hanbit Chang
 */
async function getEditAssigned() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userData = await loadDataBackend(`api/users/profiles/${user.user_id}/`);
  let contactsData = userData.contacts;
  let assignedUsers = getAssignedUserElements();
  if (assignedUsers.length != 0) { getEditContacts(assignedUsers, contactsData); toggleCheckUsers(contactsData); }
}

/**
 * Retrieves the assigned user names for a specific task from the data array.
 *
 * @return {Array} An array of user names that are currently assigned to the task.
 */
async function getAssignedUserElements() {
  let assignedUsers = [];
  let data = await loadDataBackend(`api/tasks/${id}/`);
  assignedUsers = data["assigned"];
  return assignedUsers;
}

/**
 * Generates the HTML list of contacts for the edit view, with checkboxes indicating which contacts are assigned.
 *
 * @param {Array} assignedUsers - An array of user names that are currently assigned to the task.
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @author Hanbit Chang
 */
function getEditContacts(assignedUsers, contacts) {
  const contactList = document.getElementById("assigned-list-items");
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
 * Toggles the "checked" class on the assigned items and updates the checked users list.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @author Hanbit Chang
 */
function toggleCheckUsers(contacts) {
  const assignedItems = document.querySelectorAll(".assigned-item");
  assignedItems.forEach((item) => {
    checkUsers(contacts);
    item.onclick = () => {
      item.classList.toggle("checked");
      checkUsers(contacts);
    };
  });
}

/**
 * Updates the checked users list based on the selected contacts.
 *
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @author Hanbit Chang
 */
function checkUsers(contacts) {
  const checked = document.querySelectorAll(".checked");
  const btnText = document.querySelector(".btn-text");
  const checkedUsers = document.getElementById("assigned-users-editCard");
  if (checked && checked.length > 0) {
    btnText.innerText = `${checked.length} Selected`;
    checkedUsers.innerHTML = "";
    const userNames = document.querySelectorAll(".checked .item-text");
    let i = 0;
    userNames.forEach((userName) => {
      const personWithName = contacts.find((person) => person.name == userName.innerHTML);
      if (personWithName) {
        let name = getInitials(personWithName["name"]);
        if (i < 3) checkedUsers.innerHTML += getEditAssignedUser(personWithName["color"], name);
        i++;
      }
    });
    checkedUsersConditionOverFlowed(i, checkedUsers);
  } else emptyCheckedUsers();
}

/**
 * Empties the checked users list and updates the button text.
 *
 * @return {void}
 */
function emptyCheckedUsers() {
  const btnText = document.querySelector(".btn-text");
  const checkedUsers = document.getElementById("assigned-users-editCard");
  btnText.innerText = "Select contacts to assign";
  checkedUsers.innerHTML = "";
}

/**
 * Checks if the number of checked users exceeds a certain limit and adds a new user to the checkedUsers element.
 *
 * @param {number} i - The number of checked users.
 * @param {HTMLElement} checkedUsers - The element where the checked users are displayed.
 * @return {void} This function does not return a value.
 */
function checkedUsersConditionOverFlowed(i, checkedUsers) {
  if (i > 3) {
    checkedUsers.innerHTML += /*html*/ `
      <div class="assigned-user">
        <div id="board-user" class="board-user-editCard" style="background-color: #2A3647">+${i - 3}</div>
      </div>`;
  }
}

/**
 * Returns an HTML string representing an assigned user element with a background color and name.
 *
 * @param {string} color - The background color of the assigned user element.
 * @param {string} name - The name of the assigned user.
 * @return {string} - The HTML string representing the assigned user element.
 * @author Hanbit Chang
 */
function getEditAssignedUser(color, name) {
  return /*html*/ `
  <div class="assigned-user">
    <div id="board-user" class="board-user-editCard" style="background-color: ${color}">${name}</div>
  </div>`;
}

/**
 * Generates initials from a name string.
 *
 * @param {string} name - The full name from which initials are generated.
 * @return {string} - The initials extracted from the name.
 * @author Hanbit Chang
 */
function getInitials(name) {
  let words = name.split(" ");
  let initials = "";
  for (let word of words) {
    initials += word[0].toUpperCase();
  }
  return initials;
}

/**
 * Generates the HTML for the subtasks list and updates the DOM with it.
 *
 * @param {Array} subtasks - An array of objects containing the task for each subtask.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getEditSubtasks(subtasks) {
  const list = document.getElementById("subtasks-list");
  list.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    list.innerHTML += getEditSubtasksList(subtasks[i]["title"]);
  }
}

/**
 * Generates the HTML for a subtask list item with a task name and edit/trash buttons.
 *
 * @param {string} task - The name of the task to display in the subtask list item.
 * @return {string} The HTML code for the subtask list item.
 * @author Hanbit Chang
 */
function getEditSubtasksList(task) {
  return /*html*/ `
  <li id="subtasks-li" class="subtasks-li-content">
    <div class="subtasks-li-container">
      <p class="subtasks-li-text" contenteditable=false>${task}</p>
      <div class="subtasks-row" id="subtask-first-btns">
        <img class="subtasks-btn-none" id="subtasks-edit" src="../assets/icons/board/edit/edit_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-trash" src="../assets/icons/board/edit/trash_button.svg" alt="">  
      </div>
      <div class="subtasks-row d-none" id="subtask-second-btns">
        <img class="subtasks-btn-none" id="subtasks-trash" src="../assets/icons/board/edit/trash_button.svg" alt="">
        <div class="subtasks-line-none"></div>
        <img class="subtasks-btn-none" id="subtasks-checker" src="../assets/icons/board/edit/check_button.svg" alt="" />
      </div>  
    </div>
  </li>
  `;
}

/**
 * Attaches a click event listener to all elements with the id "subtasks-trash".
 * When clicked, the function finds the closest parent element with the id "subtasks-li"
 * and removes it from the DOM.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function onClickTrash() {
  const trashes = document.querySelectorAll("#subtasks-trash");
  trashes.forEach((trash) => {
    trash.onclick = () => {
      let parentLi = trash.closest("#subtasks-li");
      if (parentLi) parentLi.remove();
    };
  });
}

/**
 * Attaches a click event listener to all elements with the id "subtasks-edit".
 * When clicked, the function finds the closest parent element with the class "subtasks-li-container"
 * and performs the following actions:
 * - Hides the element with the id "subtask-first-btns"
 * - Shows the element with the id "subtask-second-btns"
 * - Sets the contentEditable property of the element with the class "subtasks-li-text" to true.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function onClickEditing() {
  const edits = document.querySelectorAll("#subtasks-edit");
  edits.forEach((edit) => {
    edit.onclick = () => {
      const parentContent = edit.closest(".subtasks-li-container");
      const subtaskElement = parentContent.querySelector(".subtasks-li-text");
      const subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      const subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.add("d-none");
      subtaskSecondBtns.classList.remove("d-none");
      subtaskElement.contentEditable = true;
    };
  });
}

/**
 * Attaches a click event listener to all elements with the id "subtasks-checker".
 * When clicked, the function finds the closest parent element with the class "subtasks-li-container"
 * and performs the following actions:
 * - Hides the element with the id "subtask-first-btns"
 * - Shows the element with the id "subtask-second-btns"
 * - Sets the contentEditable property of the element with the class "subtasks-li-text" to false.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function onClickChecker() {
  const checkers = document.querySelectorAll("#subtasks-checker");
  checkers.forEach((checker) => {
    checker.onclick = () => {
      const parentContent = checker.closest(".subtasks-li-container");
      const subtaskElement = parentContent.querySelector(".subtasks-li-text");
      const subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      const subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.remove("d-none");
      subtaskSecondBtns.classList.add("d-none");
      subtaskElement.contentEditable = false;
    };
  });
}

/**
 * Attaches event listeners for subtasks.
 *
 * This function calls the `onClickTrash`, `onClickEditing`, and `onClickChecker` functions
 * to attach event listeners for the corresponding actions.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getSubtasksEventListeners() {
  onClickTrash();
  onClickEditing();
  onClickChecker();
}

/**
 * Sets the minimum date of the "date-editCard" input field to the current date and
 * sets the value of the "date-editCard" input field to the provided date.
 *
 * @param {string} date - The date to be set as the value of the "date-editCard" input field.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getEditDate(date) {
  const dateData = document.getElementById("date-editCard");
  dateData.min = new Date().toISOString().split("T")[0];
  dateData.value = date;
}

let show = true;

/**
 * Toggles the visibility of the checkboxes element by changing its display style property.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function showCheckboxes() {
  const checkboxes = document.getElementById("checkBoxes");
  if (show) {
    checkboxes.style.display = "block";
    show = false;
  } else {
    checkboxes.style.display = "none";
    show = true;
  }
}

/**
 * Retrieves data from the "users" object based on the provided key.
 *
 * @param {string} data - The key to retrieve data from the "users" object.
 * @return {Promise<any>} A promise that resolves to the data retrieved from the "users" object.
 * @author Hanbit Chang
 */
async function getData(data) {
  let user = JSON.parse(localStorage.getItem('user'));
  let userId = user.user_id;
  let fulldata = await loadDataBackend(`api/users/profiles/${userId}/`);
  return fulldata[data];
}
