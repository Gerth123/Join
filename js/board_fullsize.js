/**
 * Gets the full size board
 * @param {number} id
 * @param {number} contentId
 */
async function getFullSizeBoard(id, contentId) {
  const title = document.querySelector(".full-size-title");
  const description = document.querySelector(".full-size-description");
  const date = document.querySelector("#full-size-due-date");
  console.log(data);
  let itemData = await getItemById(id, contentId);
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
      if (i < 3) {
        fullSizeAssigned.innerHTML += /*html*/ `
        <li class="full-size-assign-user">
          <div id="board-user" class="board-user" style="background-color:${user["color"]}">${name}</div>
          <div class="board-username">
            ${user["name"]}
          </div>
        </li>`;
      }
      i++;
    });

    if (i > 3) {
      fullSizeAssigned.innerHTML += /*html*/ `
      <li class="full-size-assign-user">
        <div id="board-user" class="board-user" style="background-color:#2A3647">+${i - 3}</div>
      </li>`;
    }
  }
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
    <li class="full-size-subtask-li">
      <input type="checkbox" id="subtask-${i}">
      <label class="full-size-p" for="subtask-${i}">${subtasks[i]["task"]}</label>
    </li>`;
  }
  for (let i = 0; i < subtasks.length; i++) {
    const check = document.getElementById(`subtask-${i}`);
    if (subtasks[i]["checked"]) check.checked = true;
  }

  const subtaskList = document.querySelectorAll(".full-size-subtask-li");
  const idElement = document.getElementById(`${id}`);
  const progressBar = idElement.querySelector("#progress-bar");
  const label = idElement.getElementsByTagName("LABEL");
}
