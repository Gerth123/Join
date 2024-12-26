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
  let assignedUsers = await updateAssigned();
  saveTheActualUser(assignedUsers);
  let fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
  let userData = await getUserData();
  renderBoards(userData.tasks);
  getEventListeners();
  getDropZones();
  setAssignedAddTask();
}

/**
 * Extracts the contact IDs of all checked assigned items.
 * @returns {Array} An array of contact IDs as strings.
 */
function getCheckedContactIds() {
  const assignedItems = document.querySelectorAll(".assigned-item");
  const contactIds = [];

  assignedItems.forEach((item) => {
    const boardUser = item.querySelector(".board-user");
    if (item.classList.contains("checked") && boardUser) {
      const contactId = boardUser.id.match(/\d+$/)?.[0];
      if (contactId) {
        contactIds.push(contactId);
      }
    }
    item.classList.remove("checked"); // Remove the "checked" class from all items
  });

  return contactIds;
}

/**
 * Fetches the contact data for the given contact IDs.
 * @param {Array} contactIds - An array of contact IDs as strings.
 * @returns {Promise<Array>} A promise that resolves to an array of assigned user objects.
 */
async function fetchAssignedContacts(contactIds) {
  const assignedUsers = [];
  for (const contactId of contactIds) {
    try {
      const actualContact = await loadDataBackend(`api/contacts/single/${contactId}/`);
      assignedUsers.push(actualContact);
    } catch (error) {
      console.error("Error loading contact data for ID:", contactId, error);
    }
  }
  return assignedUsers;
}

/**
 * Updates the assigned users for the task.
 * @returns {Promise<Array>} A promise that resolves to an array of assigned user objects.
 */
async function updateAssigned() {
  const contactIds = getCheckedContactIds();
  const assignedUsers = await fetchAssignedContacts(contactIds);
  return assignedUsers;
}



/**
 * Returns an array of contacts data by filtering out any null values from the contacts array.
 *
 * @return {Array} An array of contact objects with no null values.
 */
async function getContactsData() {
  let task = await loadDataBackend(`api/tasks/${id}/`);
  let contactsData = task.assigned;
  return contactsData;
}

/**
 * Saves the actual user by retrieving the contacts data and the actual user number from the URL parameters.
 * Then, iterates over the data array to find the item with the specified contentId.
 * For each item, it sets the edited values using the setEditItems function and sends the updated data back to the server.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and sent back to the server.
 */
async function saveTheActualUser(assignedUsers) {
  let data = await getTaskContent(assignedUsers);
  await putDataBackend(`api/tasks/${id}/`, data);
  initBoard();
}

/**
 * Retrieves the content of the task to be edited, including title, description, date, priority, subtasks, and assigned contacts.
 * 
 * @return {Object} An object containing the content of the task to be edited.
 */
async function getTaskContent(assignedUsers) {
  const title = document.getElementById("title-editCard");
  const description = document.getElementById("description-editCard");
  const date = document.getElementById("date-editCard");
  const priority = editPriorityValue();
  await getEditSubTasksValue();
  const assigned = assignedUsers;
  let data = {
    title: title.value,
    description: description.value,
    date: date.value,
    priority: priority,
    assigned_data: assigned,
  };
  return data;
}

/**
 * Fetches and updates subtasks from the DOM and backend.
 * @returns {Array} The updated subtasks list.
 */
async function getEditSubTasksValue() {
  let task = await loadDataBackend(`api/tasks/${id}/`);
  let actualSubtasks = task.subtasks;
  let subtasks = [];
  let subtasksList = document.getElementById("subtasks-list").children;
  for (let i = 0; i < subtasksList.length; i++) {
    let subtask = extractSubtaskData(subtasksList[i]);
    let matchingSubtask = actualSubtasks.find(s => s.id == subtask.id);
    if (matchingSubtask) matchingSubtask.title = subtask.title;
    else subtasks.push(subtask);
  }
  await removeDeletedSubtasks(actualSubtasks, subtasksList);
  await addNewSubtasks(subtasks);
  return subtasks;
}

/**
 * Extracts the subtask data from a DOM element.
 * @param {HTMLElement} element The subtask DOM element.
 * @returns {Object} The subtask data with id and title.
 */
function extractSubtaskData(element) {
  let subtaskId = element.querySelector(".subtasks-li-text").id.replace('subtask-', '');
  let subtaskTitle = element.querySelector(".subtasks-li-text").textContent.trim();
  return { id: subtaskId, title: subtaskTitle, checked: false };
}

/**
 * Removes subtasks from the backend if no longer present in the DOM.
 * @param {Array} actualSubtasks The current subtasks from the backend.
 * @param {HTMLCollection} subtasksList The current list of subtasks in the DOM.
 */
async function removeDeletedSubtasks(actualSubtasks, subtasksList) {
  for (let subtask of actualSubtasks) {
    let found = Array.from(subtasksList).some(li =>
      li.querySelector(".subtasks-li-text").id === `subtask-${subtask.id}`);
    if (!found) await deleteSubtaskFromBackend(subtask.id);
  }
}

/**
 * Fügt neue Unteraufgaben zum Backend hinzu und entfernt die ID, bevor sie gesendet wird.
 * @param {Array} subtasks Die Liste der neuen Unteraufgaben.
 */
async function addNewSubtasks(subtasks) {
  let obj = { subtasks_data: [] };
  for (let subtask of subtasks) {
    if (!subtask.id) {
      let { id, ...subtaskWithoutId } = subtask;
      obj.subtasks_data.push(subtaskWithoutId);
    }
  }
  if (obj.subtasks_data.length > 0) {
    try {
      await putDataBackend(`api/tasks/${id}/`, obj);
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Unteraufgaben:", error);
    }
  }
}


/**
 * Deletes a subtask from the backend by its ID.
 * @param {string} subtaskId - The ID of the subtask to delete.
 */
async function deleteSubtaskFromBackend(subtaskId) {
  await deleteDataBackend(`api/tasks/${id}/subtasks/${subtaskId}/`);
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
          id: contact["id"],
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
 * Updates the subtasks based on the current values of the subtasks text (without checked state).
 * @returns {Array} The updated subtasks list with only the title.
 */
function editSubTasksValue(subtasks) {
  const newSubtasks = document.querySelectorAll(".subtasks-li-text");
  if (subtasks == "") subtasks = [];
  if (subtasks.length < newSubtasks.length) {
    for (let i = subtasks.length; i < newSubtasks.length; i++) {
      subtasks.push({ checked: false, title: newSubtasks[i].innerHTML });
    }
  } else if (subtasks.length >= newSubtasks.length) {
    let temp = [];
    newSubtasks.forEach((task) => {
      temp.push({ checked: false, title: task.textContent });
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
