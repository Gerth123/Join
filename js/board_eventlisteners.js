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
  let i = 0;
  subtaskAddBtn.addEventListener("click", () => {
    subtaskAddBtn.classList.add("d-none");
    subtaskContainer.classList.remove("d-none");
  });

  subtaskDelBtn.addEventListener("click", () => {
    subtaskInput.value = "";
  });

  subtaskCheckBtn.addEventListener("click", () => {
    list.innerHTML += /*html*/ `
    <li id="subtasks-li">
      <div class="subtasks-li-container">
        <div class="subtasks-li-text" contenteditable=false>
          ${subtaskInput.value}
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
