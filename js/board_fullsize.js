/**
 * Gets the full size board
 * @param {number} id
 */
async function getFullSizeBoard(id) {
  const title = document.querySelector(".full-size-title");
  const description = document.querySelector(".full-size-description");
  const date = document.querySelector("#full-size-due-date");
  let itemData = await getItemById(id);
  title.textContent = `${itemData["title"]}`;
  description.textContent = `${itemData["description"]}`;
  date.textContent = "";
  date.textContent += `${itemData["date"]}`;
  getFullSizePriority(itemData["priority"]);
  getFullSizeCategory(itemData["category"]);
  getFullSizeAssigned(itemData["assigned"]);
  getFullSizeSubtask(itemData["subtasks"]);
}

/**
 * Gets the full size priority
 * @param {Object} priority
 */
function getFullSizePriority(priority) {
  const fullSizePriority = document.querySelector(".full-size-priority-icon");
  fullSizePriority.src = icons["priorityFullSizeIcons"][priority] || "";
}

/**
 * Gets the full size category
 * @param {Object} category
 */
function getFullSizeCategory(category) {
  const fullSizeCategory = document.querySelector("#full-size-category");
  fullSizeCategory.src = icons["categoryFullSizeIcons"][category] || "";
}

/**
 * Gets the full size assigned
 * @param {Object} assigned
 */
function getFullSizeAssigned(assigned) {
  const fullSizeAssigned = document.querySelector("#full-size-assigned-users");
  fullSizeAssigned.innerHTML = "";
  if (assigned != "") {
    let i = 0;
    assigned.forEach((user) => {
      let name = getInitials(user["name"]);
      if (i < 3) fullSizeAssigned.innerHTML += assignedFullsize(user, name);
      i++;
    });
    if (i > 3) fullSizeAssigned.innerHTML += assignedFullSizeOverFlowed(i);
  }
}

/**
 * Generates the HTML for a full-size assigned user.
 *
 * @param {Object} user - The user object containing the user's color.
 * @param {string} name - The name of the user.
 * @return {string} The HTML string for the full-size assigned user.
 */
function assignedFullsize(user, name) {
  return /*html*/ `
  <li class="full-size-assign-user">
    <div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}</div>
    <div class="board-username">
      ${user["name"]}
    </div>
  </li>`;
}

/**
 * Generates the HTML for a full-size assigned user with an overflow count.
 *
 * @param {number} i - The number of assigned users.
 * @return {string} The HTML string for the full-size assigned user with an overflow count.
 */
function assignedFullSizeOverFlowed(i) {
  return /*html*/ `
  <li class="full-size-assign-user">
    <div id="board-user" class="board-user" style="background-color:#2A3647">+${i - 3}</div>
  </li>`;
}

/**
 * Clears the list of subtasks in the specified container.
 * @param {HTMLElement} container The container to clear.
 */
function clearSubtaskList(container) {
  container.innerHTML = "";
}

/**
 * Creates a list item element for a subtask.
 * @param {number} id The ID of the subtask.
 * @param {string} title The title of the subtask.
 * @param {boolean} checked The checked state of the subtask.
 * @returns {HTMLElement} The created list item element.
 */
function createSubtaskItem(id, title, checked) {
  const li = document.createElement("li");
  li.className = "full-size-subtask-li";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `subtask-${id}`;
  checkbox.checked = checked;
  const label = document.createElement("label");
  label.className = "full-size-p";
  label.htmlFor = `subtask-${id}`;
  label.textContent = title;
  li.appendChild(checkbox);
  li.appendChild(label);
  return li;
}

/**
 * Updates the full-size subtask list.
 * @param {Array} subtasks The list of subtasks.
 */
function getFullSizeSubtask(subtasks) {
  const fullSizeSubtasks = document.getElementById("full-size-subtasks-tasks");
  clearSubtaskList(fullSizeSubtasks);
  subtasks.forEach(subtask => {
    const { id, title, checked } = subtask;
    const subtaskItem = createSubtaskItem(id, title, checked);
    fullSizeSubtasks.appendChild(subtaskItem);
  });
}

