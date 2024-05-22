function allowDrop(ev) {
  ev.preventDefault();
}
function getDropZones() {
  const draggables = document.querySelectorAll(".board-card-dropzone");
  draggables.forEach((task) => {
    doDragOver(task);
    doDragLeave(task);
  });
}

function doDragOver(task) {
  task.addEventListener("dragover", () => {
    task.classList.add("board-card-dropzone--active");
  });
}

function doDragLeave(task) {
  task.addEventListener("dragleave", () => {
    task.classList.remove("board-card-dropzone--active");
  });
}

function doSetData(e, id) {
  e.dataTransfer.setData("text/plain", id);
}

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
  init();
}

function getClosestContent(draggableId) {
  const idElement = document.getElementById(draggableId);
  const closestTaskforId = idElement.closest(".board-card-content");
  const itemsInColumn = Array.from(closestTaskforId.querySelectorAll(".board-card"));
  let closestClickedContentID = closestTaskforId.id;
  let itemsIndex = itemsInColumn.indexOf(idElement);
  return [closestClickedContentID, itemsIndex];
}

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
