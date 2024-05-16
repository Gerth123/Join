/**
 * Gets the full size board
 * @param {number} id
 * @param {number} contentId
 */
function getFullSizeBoard(id, contentId) {
  let itemData = getItemById(id, contentId);
  let title = document.querySelector(".full-size-title");
  let description = document.querySelector(".full-size-description");
  let date = document.querySelector("#full-size-due-date");
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
  assigned.forEach((user) => {
    let name = Array.from(`${user["name"]}`)[0];
    let lastName = Array.from(`${user["lastName"]}`)[0];
    fullSizeAssigned.innerHTML += /*html*/ `
    <li class="full-size-assign-user">
    <div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}${lastName}</div>
    <div class="board-username">
      ${user["name"]} ${user["lastName"]} 
    </div>
   
    </li>`;
  });
}

/**
 * Gets the full size subtasks
 * @param {Object} subtasks
 */
function getFullSizeSubtask(subtasks) {
  const fullSizeSubtasks = document.getElementById("full-size-subtasks-tasks");
  fullSizeSubtasks.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    fullSizeSubtasks.innerHTML += /*html*/ `
    <input type="checkbox" id="subtask-${i}">
    <label for="subtask-${i}">${subtasks[i]["task"]}</label>
    `;
  }
  for (let i = 0; i < subtasks.length; i++) {
    let check = document.getElementById(`subtask-${i}`);
    if (subtasks[i]["checked"]) {
      check.checked = true;
    }
  }
}
