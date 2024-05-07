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
  onClickEditSubtasks();
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
    list.innerHTML += /*html*/ `
    <li class="subtasks-li-container">
      <div class="subtasks-li">
        ${subtaskInput.value}
        <div class="row">
          <img id="subtasks-edit" class="subtasks-btn-none" src="/assets/icons/board/edit/edit_button.svg" alt="">
          <img id="subtasks-trash" class="subtasks-btn-none" src="/assets/icons/board/edit/trash_button.svg" alt="">
        </div>
      </div>
    </li>
    `;
    subtaskInput.value = "";
    subtaskContainer.classList.add("d-none");
    subtaskAddBtn.classList.remove("d-none");
  });

  const subtaskTrash = document.querySelectorAll("#subtasks-trash");
  subtaskTrash.forEach((trash) => {
    trash.addEventListener("click", () => {
      console.log(trash);
    });
  });
}
