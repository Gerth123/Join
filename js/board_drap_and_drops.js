function allowDrop(ev) {
  ev.preventDefault();
}
function getDropZones() {
  const draggables = document.querySelectorAll(".board-card-dropzone");
  draggables.forEach((task) => {
    doDragOver(task);
    doDragLeave(task);
    // doDrop(task);
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

async function doDrop(e, target) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  // task.addEventListener("drop", (e) => {
  e.preventDefault();
  // console.log(e);
  // console.log("e.id", e.target.id);
  // console.log("target.id", target.id);
  let draggableId = e.dataTransfer.getData("text/plain");
  let idElement = document.getElementById(draggableId);
  console.log("this is id", idElement);
  let closestTaskforId = idElement.closest(".board-card-content");
  let closestClickedContentID = closestTaskforId.id;
  // console.log("closest", closestTaskforId);
  let itemsInColumn = Array.from(closestTaskforId.querySelectorAll(".board-card"));
  // console.log(itemsInColumn);
  let itemsIndex = itemsInColumn.indexOf(idElement);

  let task = e.target;
  task.classList.remove("board-card-dropzone--active");
  // console.log(e.closest(".kanban-content"));
  // task.classList.remove("board-card-dropzone--active");
  let closestTask = task.closest(".board-card-content");
  let closestDroppedContentID = closestTask.id;
  // console.log(closestTask);
  let contentId = Number(closestTask.id);
  let dropZonesInColumn = Array.from(closestTask.querySelectorAll(".board-card-dropzone"));
  let droppedIndex = dropZonesInColumn.indexOf(task);
  let itemId = Number(e.dataTransfer.getData("text/plain"));
  let droppedItemElement = document.querySelector(`[id="${itemId}"]`);
  const insertAfter = task.parentElement.classList.contains("board-card") ? task.parentElement : task;
  // console.log("closestTask", closestTask);
  // console.log("contentId", contentId);
  // console.log("closestClickedContentID", closestClickedContentID);
  // console.log("closestDroppedID", closestDroppedContentID);
  // console.log("itemsIndex", itemsIndex);
  // console.log("droppedIndex", droppedIndex);
  // console.log("dropZonesInColumn", dropZonesInColumn);
  // console.log("dropzone", droppedItemElement.contains(task));
  if (droppedItemElement.contains(task)) {
    return;
  }

  if (itemsIndex < droppedIndex && closestClickedContentID == closestDroppedContentID) {
    droppedIndex--;
  }

  // console.log("dropped index update", droppedIndex);

  insertAfter.after(droppedItemElement);
  // console.log("ondrop data", read());
  await updateItem(`users/${actualUsersNumber}/tasks/`, itemId, {
    contentId,
    position: droppedIndex,
  });
  init();
}

async function updateItem(path = "", itemId, newProps) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  const data = fulldata[actualUsersNumber]["tasks"];

  const [item, currentColumn] = (() => {
    for (const column of data) {
      if (column.items == "") {
        column.items = [];
      }
      const item = column.items.find((item) => item.id == itemId);

      console.log("item", item);
      console.log("column.items", column.items);
      console.log("column", column.items.length == 0);
      if (column.items.length == 0) {
        column.items = "";
      }
      if (item) return [item, column];
    }
  })();

  console.log("this it data", data);

  item.content = newProps.content === undefined ? item.content : newProps.content;
  // Update column and position
  if (newProps.contentId !== undefined && newProps.position !== undefined) {
    const targetColumn = data.find((column) => column.id == newProps.contentId);
    if (!targetColumn) throw new Error("Target column not found");

    if (currentColumn.items == "") {
      currentColumn.items = [];
    }

    currentColumn.items.splice(currentColumn.items.indexOf(item), 1); //Delete the item from it's current column
    // console.log("currentColumn", currentColumn.items);
    // console.log(currentColumn.items.length == 0);
    if (currentColumn.items.length == 0) {
      currentColumn.items = "";
    }

    if (targetColumn.items == "") {
      targetColumn.items = [];
    }
    console.log("targetColumn", targetColumn);
    targetColumn.items.splice(newProps.position, 0, item); // Move item into its new column and position
    if (targetColumn.items.length == 0) {
      targetColumn.items = "";
    }
  }

  console.log(data);

  let response = await fetch(baseUrl + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}
