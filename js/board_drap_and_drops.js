/**
 * Allows dropping
 * @param {Event} ev
 *
 * @author Hanbit Chang
 */
function allowDrop(ev) {
  ev.preventDefault();
}

function allowContents(ev) {
  ev.classList.add("d-none");
}

function allowContentsShow(ev) {
  ev.classList.remove("d-none");
}

/**
 * Get DropZones
 *
 * @author Hanbit Chang
 */
function getDropZones() {
  const draggables = document.querySelectorAll(".board-card-dropzone");
  draggables.forEach((task) => {
    doDragOver(task);
    doDragLeave(task);
  });
}

/**
 * Adds an event listener to the given task element to handle the "dragover" event.
 * When the event is triggered, it adds the CSS class "board-card-dropzone--active" to the task element.
 *
 * @param {HTMLElement} task - The task element to add the event listener to.
 * @author Hanbit Chang
 */
function doDragOver(task) {
  task.addEventListener("dragover", () => {
    task.classList.add("board-card-dropzone--active");
  });
}

/**
 * Adds an event listener to the given task element to handle the "dragleave" event.
 * When the event is triggered, it removes the CSS class "board-card-dropzone--active" from the task element.
 *
 * @param {HTMLElement} task - The task element to add the event listener to.
 * @author Hanbit Chang
 */
function doDragLeave(task) {
  task.addEventListener("dragleave", () => {
    task.classList.remove("board-card-dropzone--active");
  });
}

/**
 * Sets the data to be transferred during a drag and drop operation.
 *
 * @param {Event} e - The drag event.
 * @param {number} id - The ID of the data to be transferred.
 * @return {void} This function does not return a value.
 * @author Hanbit Chang
 */
function doSetData(e, id) {
  e.dataTransfer.setData("text/plain", id);
}

/**
 * Handles the drop event and performs the necessary operations.
 *
 * @param {Event} e - The drop event.
 * @return {Promise<void>} A promise that resolves when the operation is complete.
 * @author Hanbit Chang
 */
async function doDrop(e) {
  e.preventDefault();
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let draggableId = e.dataTransfer.getData("text/plain");
  let [closestClickedContentID, itemsIndex] = getClosestContent(draggableId);
  let task = e.target;
  task.classList.remove("board-card-dropzone--active");
  const closestTask = task.closest(".board-card-content");
  let closestDroppedContentID = closestTask.id;
  let contentId = Number(closestTask.id);
  let dropZonesInColumn = Array.from(closestTask.querySelectorAll(".board-card-dropzone"));
  let droppedIndex = dropZonesInColumn.indexOf(task);
  let itemId = Number(e.dataTransfer.getData("text/plain"));
  const droppedItemElement = document.querySelector(`[id="${itemId}"]`);
  let insertAfter = task.parentElement.classList.contains("board-card") ? task.parentElement : task;

  if (droppedItemElement.contains(task)) return;
  if (itemsIndex < droppedIndex && closestClickedContentID == closestDroppedContentID) droppedIndex--;

  insertAfter.after(droppedItemElement);
  await updateItem(`users/${actualUsersNumber}/tasks/`, itemId, {
    contentId,
    position: droppedIndex,
  });
  initBoard();
}

/**
 * Retrieves the closest content element and its index for a given draggable element.
 *
 * @param {string} draggableId - The ID of the draggable element.
 * @return {Array} An array containing the closest content element's ID and the index of the draggable element within the content.
 * @author Hanbit Chang
 */
function getClosestContent(draggableId) {
  const idElement = document.getElementById(draggableId);
  const closestTaskforId = idElement.closest(".board-card-content");
  const itemsInColumn = Array.from(closestTaskforId.querySelectorAll(".board-card"));
  let closestClickedContentID = closestTaskforId.id;
  let itemsIndex = itemsInColumn.indexOf(idElement);
  return [closestClickedContentID, itemsIndex];
}

/**
 *  Updates an item in the data with the given properties.
 *
 * @param {*} path
 * @param {*} itemId
 * @param {*} newProps
 * @author Hanbit Chang
 */
async function updateItem(path = "", itemId, newProps) {
  let data = await getData("tasks");
  let [item, currentColumn] = (() => {
    for (let column of data) {
      if (column.items == "") column.items = [];
      let item = column.items.find((item) => item.id == itemId);
      if (column.items.length == 0) column.items = "";
      if (item) return [item, column];
    }
  })();

  item.content = newProps.content === undefined ? item.content : newProps.content;
  if (newProps.contentId !== undefined && newProps.position !== undefined) {
    let targetColumn = data.find((column) => column.id == newProps.contentId);

    if (currentColumn.items == "") currentColumn.items = [];
    currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
    if (currentColumn.items.length == 0) currentColumn.items = "";

    if (targetColumn.items == "") targetColumn.items = [];
    targetColumn.items.splice(newProps.position, 0, item);
    if (targetColumn.items.length == 0) targetColumn.items = "";
  }

  await putData(path, data);
}
