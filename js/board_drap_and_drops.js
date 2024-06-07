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
  setDragBoard();
}

/**
 * Sets the drag and drop functionality for elements with the class "board-card".
 *
 * @return {void}
 */
function setDragBoard() {
  const elements = document.querySelectorAll(".board-card");
  elements.forEach((element) => {
    element.ondrag = function (e) {
      e.target.classList.add("dragging");
    };
    element.ondragend = function (e) {
      e.target.classList.remove("dragging");
    };
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
  task.ondragenter = () => {
    task.classList.add("board-card-dropzone--active");
  };
}

/**
 * Adds an event listener to the given task element to handle the "dragleave" event.
 * When the event is triggered, it removes the CSS class "board-card-dropzone--active" from the task element.
 *
 * @param {HTMLElement} task - The task element to add the event listener to.
 * @author Hanbit Chang
 */
function doDragLeave(task) {
  task.ondragleave = () => {
    task.classList.remove("board-card-dropzone--active");
  };
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
  let task = e.target;
  task.classList.remove("board-card-dropzone--active");
  let draggableId = e.dataTransfer.getData("text/plain");
  let [closestClickedContentID, itemsIndex] = getClosestContent(draggableId);
  const closestTask = task.closest(".board-card-content");
  let closestDroppedContentID = closestTask.id;
  let contentId = Number(closestTask.id);
  let dropZonesInColumn = Array.from(closestTask.querySelectorAll(".board-card-dropzone"));
  let droppedIndex = dropZonesInColumn.indexOf(task);
  let itemId = Number(e.dataTransfer.getData("text/plain"));
  let insertAfter = task.parentElement.classList.contains("board-card") ? task.parentElement : task;
  let removeCard = document.getElementById(`${itemId}`);
  removeCard.classList.add("d-none");
  const droppedItemElement = document.querySelector(`[id="${itemId}"]`);
  if (droppedItemElement.contains(task)) return;
  if (itemsIndex < droppedIndex && closestClickedContentID == closestDroppedContentID) droppedIndex--;

  insertAfter.after(droppedItemElement);
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  updateItem(itemId, {
    contentId,
    position: droppedIndex,
  });
  renderBoards(data);
  getEventListeners();
  getDropZones();
  await putData(`users/${actualUsersNumber}/tasks/`, data);
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
async function updateItem(itemId, newProps) {
  let [item, currentColumn] = (() => {
    for (let column of data) {
      if (column.items == "") column.items = [];
      let item = column.items.find((item) => item.id == itemId);
      if (column.items.length == 0) column.items = "";
      if (item) return [item, column];
    }
  })();

  item.content = newProps.content === undefined ? item.content : newProps.content;
  updateItemPosition(item, currentColumn, newProps);
}

function updateItemPosition(item, currentColumn, newProps) {
  if (newProps.contentId !== undefined && newProps.position !== undefined) {
    let targetColumn = data.find((column) => column.id == newProps.contentId);

    // Handle empty item arrays in current and target columns
    if (currentColumn.items === "") currentColumn.items = [];
    currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
    if (currentColumn.items.length === 0) currentColumn.items = "";

    if (targetColumn.items === "") targetColumn.items = [];
    targetColumn.items.splice(newProps.position, 0, item);
    if (targetColumn.items.length === 0) targetColumn.items = "";
  }
}
