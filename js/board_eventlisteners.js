let id;
let contentId;

/**
 * EventListeners
 */
function getEventListeners() {
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  onClickFullSizeBoard(fullsize, board, editBoard, addBoard);
  onClickCloseFullSize(fullsize);
  onClickAddTaskBoard(fullsize, board, editBoard, addBoard);
  onClickEditBoard(board, editBoard, addBoard);
}

/**
 * Onclick gets the full-size board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickFullSizeBoard(fullsize, board, editBoard, addBoard) {
  const boardCard = document.querySelectorAll(".board-card");
  boardCard.forEach((card) =>
    card.addEventListener("click", () => {
      fullsize.classList.remove("d-none");
      board.classList.remove("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.add("d-none");
      id = card.id;
      contentId = card.parentNode.id;
      getFullSizeBoard(id, contentId);
    })
  );
}

/**
 * Onclick closes the full-size
 * @param {Element} fullsize
 */
function onClickCloseFullSize(fullsize) {
  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      fullsize.classList.add("d-none");
      let itemData = getItemById(id, contentId);
      let subtasks = itemData["subtasks"];
      for (let i = 0; i < subtasks.length; i++) {
        let check = document.getElementById(`subtask-${i}`);
        if (check.checked) {
          subtasks[i]["checked"] = true;
        } else {
          subtasks[i]["checked"] = false;
        }
        console.log("subtasks", subtasks);
      }

      let data = read();
      for (let column of data) {
        if (column.id == contentId) {
          for (let item of column.items) {
            if (item.id == id) {
              item["subtasks"] = subtasks;
              console.log("items", item["subtasks"]);
            }
          }
        }
      }

      console.log("data", data);
      save(data);
      init();
    })
  );
}

/**
 * Onclick gets add-task board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickAddTaskBoard(fullsize, board, editBoard, addBoard) {
  const addTaskBtn = document.getElementById("board-header-add-btn");
  const addTaskBtnSmall = document.querySelectorAll(".board-add-btn");
  addTaskBtn.addEventListener("click", () => {
    fullsize.classList.remove("d-none");
    board.classList.add("d-none");
    editBoard.classList.add("d-none");
    addBoard.classList.remove("d-none");
  });

  addTaskBtnSmall.forEach((task) => {
    task.addEventListener("click", () => {
      fullsize.classList.remove("d-none");
      board.classList.add("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.remove("d-none");
    });
  });
}

/**
 * Onclick gets edit board
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 */
function onClickEditBoard(board, editBoard, addBoard) {
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", () => {
    board.classList.add("d-none");
    editBoard.classList.remove("d-none");
    addBoard.classList.add("d-none");
    getEditBoard(id, contentId);
    onClickEditSubtasks();
  });
}

function onClickEditSubtasks() {
  const subtaskAddBtn = document.getElementById("subtasks-add");
  const subtaskContainer = document.getElementById("subtasks-btn-container");
  const subtaskDelBtn = document.getElementById("subtasks-del");
  const subtaskCheckBtn = document.getElementById("subtasks-check");
  const subtaskInput = document.getElementById("subtasks");

  const list = document.getElementById("subtasks-list");
  subtaskAddBtn.addEventListener("click", () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  });

  subtaskDelBtn.addEventListener("click", () => {
    subtaskInput.value = "";
  });

  subtaskCheckBtn.addEventListener("click", () => {
    console.log("subtaskInput", subtaskInput.value);
    list.innerHTML += /*html*/ `
    <li id="subtasks-li">
      <div class="subtasks-li-container">
        <p class="subtasks-li-text" contenteditable=false>${subtaskInput.value}</p>
        <div class="row" id="subtask-first-btns">
          <img class="subtasks-btn-none" id="subtasks-edit" src="/assets/icons/board/edit/edit_button.svg" alt="">
          <div class="subtasks-line-none"></div>
          <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
        </div>
        <div class="row d-none" id="subtask-second-btns">
          <img class="subtasks-btn-none" id="subtasks-trash" src="/assets/icons/board/edit/trash_button.svg" alt="">
          <div class="subtasks-line-none"></div>
          <img class="subtasks-btn-none" id="subtasks-checker" src="./assets/icons/board/edit/check_button.svg" alt="" />
        </div> 
      </div>
    </li>`;
    subtaskInput.value = "";
    subtaskContainer.classList.add("d-none");
    subtaskAddBtn.classList.remove("d-none");
    getSubtasksEventListeners();
  });
}

// function getNewSubTasksEventListeners() {
//   let trashes = document.querySelectorAll("#subtasks-trash-new");
//   console.log(trashes);
//   trashes.forEach((trash) => {
//     trash.addEventListener("click", () => {
//       let parentLi = trash.closest(".subtasks-li-container");
//       if (parentLi) {
//         parentLi.remove();
//       }
//     });
//   });
// }

// function getSubtasksEventListeners() {
//   let trashes = document.querySelectorAll("#subtasks-trash");
//   trashes.forEach((trash) => {
//     trash.addEventListener("click", () => {
//       let parentLi = trash.closest(".subtasks-li-container");
//       if (parentLi) {
//         parentLi.remove();
//       }
//     });
//   });

//   let edits = document.querySelectorAll("#subtasks-edit");
//   console.log(edits);
//   edits.forEach((edit) => {
//     edit.addEventListener("click", () => {
//       let parentContent = edit.closest(".subtasks-li-container");
//       let subtaskElement = parentContent.querySelector(".subtasks-li-text");
//       let subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
//       let subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
//       subtaskFirstBtns.classList.add("d-none");
//       subtaskSecondBtns.classList.remove("d-none");
//       subtaskElement.contentEditable = true;
//     });
//   });

//   let checkers = document.querySelectorAll("#subtasks-checker");
//   checkers.forEach((checker) => {
//     checker.addEventListener("click", () => {
//       let parentContent = checker.closest(".subtasks-li-container");
//       let subtaskElement = parentContent.querySelector(".subtasks-li-text");
//       let subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
//       let subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
//       subtaskFirstBtns.classList.remove("d-none");
//       subtaskSecondBtns.classList.add("d-none");
//       subtaskElement.contentEditable = false;
//     });
//   });
// }

function saveEditData() {
  console.log(id);
  console.log(contentId);
  let data = read();
  changeItem(data, id);
}

function changeItem(data, targetId) {
  // console.log(data);
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let subtasks = document.querySelectorAll(".subtasks-li-text");
  subtasks.forEach((subtask) => {
    console.log(subtask.innerHTML);
  });

  for (const listItem of data) {
    // console.log(listItem);
    if (listItem.id == 1) {
      for (let item of listItem.items) {
        // console.log(item);
        // console.log("targetId", targetId);
        if (item.id == targetId) {
          // console.log(targetId);
          item.category = editCategory(item.category);
          item.title = title.value;
          item.description = description.value;
          item.date = date.value;
          item.priority = editPriorityValue();
          item.subtasks = editSubTasksValue(item.subtasks);
          // Return a copy of the modified data
        }
        save(data);
      }
    }
  }
  // console.log(data);

  // init();
  // return false;
}

function editCategory(category) {
  let newCategory = document.getElementById("category");
  console.log("newCategory", newCategory.value);
  console.log("Category", category);
  if (newCategory.value == "") {
    console.log("newCategory", newCategory.value);
    return category;
  } else {
    return newCategory.value;
  }
}

function editPriorityValue() {
  let priority3 = document.getElementById("radio-btn-3");
  let priority2 = document.getElementById("radio-btn-2");
  let priority1 = document.getElementById("radio-btn-1");
  // console.log(priority3.checked);
  // console.log(priority2.checked);
  // console.log(priority1.checked);
  if (priority3.checked) {
    return "urgent";
  } else if (priority2.checked) {
    return "medium";
  } else if (priority1.checked) {
    return "low";
  }
}

function editSubTasksValue(subtasks) {
  let newSubtasks = document.querySelectorAll(".subtasks-li-text");
  if (subtasks.length < newSubtasks.length) {
    for (let i = subtasks.length - 1; i < newSubtasks.length; i++) {
      subtasks.push({ checked: false, task: newSubtasks[i].innerHTML });
    }
  } else if (subtasks.length > newSubtasks.length) {
    let temp = [];
    newSubtasks.forEach((task) => {
      // console.log("this is textContent", task.textContent);
      temp.push({ checked: false, task: task.textContent });
    });
    console.log("this is temp", temp);
    let updatedSubtask = (updatedTemp = updateChecked(temp.slice(), subtasks));
    console.log(updatedSubtask);
    subtasks = updatedSubtask;
  }

  return subtasks;
}

function updateChecked(temp, Oldtask) {
  const updatedTemp = temp.map((item) => {
    const matchingTask = Oldtask.find((oldItem) => oldItem.task === item.task);
    return matchingTask ? { ...item, checked: matchingTask.checked } : item;
  });
  return updatedTemp;
}
