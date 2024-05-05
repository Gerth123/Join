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
  boardCard.forEach((e) =>
    e.addEventListener("click", () => {
      fullsize.classList.remove("d-none");
      board.classList.remove("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.add("d-none");
      let id = e.id;
      let contentId = e.parentNode.id;
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
  closeBtn.forEach((e) =>
    e.addEventListener("click", () => {
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

  addTaskBtnSmall.forEach((e) => {
    e.addEventListener("click", () => {
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
  });
}
