/**
 * Attaches event listeners to the edit board elements.
 *
 * @param {Element} board - The board element.
 * @param {Element} editBoard - The edit board element.
 * @param {Element} addBoard - The add board element.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getEditEventListeners(board, editBoard, addBoard) {
  onClickEditBoard(board, editBoard, addBoard);
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
  editBtn.onclick = async () => {
    board.classList.add("d-none");
    editBoard.classList.remove("d-none");
    addBoard.classList.add("d-none");

    await getEditBoard(id, contentId);
    onClickEditSubtasks();
  };
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
  subtaskAddBtn.onclick = () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  };
  subtaskDelBtn.onclick = () => {
    subtaskInput.value = "";
  };
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
 * Asynchronously saves the edited data by retrieving the "tasks" and "contacts" data from the server,
 * updating the items in the data array with the edited values, and then sending the updated data back to
 * the server. After the data is saved, the page is reloaded.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and the page is reloaded.
 * @author Hanbit Chang
 */
async function saveEditData() {
  saveTheActualUser();
  let fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
  renderBoards(data);
  getEventListeners();
  getDropZones();
  setAssignedAddTask();
}

/**
 * Returns an array of contacts data by filtering out any null values from the contacts array.
 *
 * @return {Array} An array of contact objects with no null values.
 */
function getContactsData() {
  let contactsData = [];
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i] != null) contactsData.push(contacts[i]);
  }
  return contactsData;
}

/**
 * Saves the actual user by retrieving the contacts data and the actual user number from the URL parameters.
 * Then, iterates over the data array to find the item with the specified contentId.
 * For each item, it sets the edited values using the setEditItems function and sends the updated data back to the server.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and sent back to the server.
 */
async function saveTheActualUser() {
  let contactsData = getContactsData();
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  for (let listItem of data) {
    if (listItem.id == contentId) {
      for (let item of listItem.items) {
        item = setEditItems(item, contactsData);
        await putData(`users/${actualUsersNumber}/tasks/`, data);
      }
    }
  }
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

function setAssignedEditTask() {
  const assignedUsers = document.getElementById("assigned-users-editCard");
  const assignedItems = document.querySelectorAll(".assigned-item");
  const assignedBtnText = document.querySelector(".btn-text");

  assignedItems.forEach((item) => {
    item.classList.remove("checked");
  });
  assignedUsers.innerHTML = "";
  assignedBtnText.innerHTML = "Select contacts to assign";
}
