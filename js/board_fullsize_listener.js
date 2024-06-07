/**
 * Onclick gets the full-size board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 * @author Hanbit Chang
 */
function onClickFullSizeBoard(fullsize, board, editBoard, addBoard) {
  const boardCard = document.querySelectorAll(".board-card");
  boardCard.forEach((card) => {
    card.onclick = () => {
      fullsize.classList.remove("d-none");
      board.classList.remove("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.add("d-none");
      id = card.id;
      contentId = card.parentNode.parentNode.id;
      getFullSizeBoard(id, contentId);
    };
  });
}

/**
 * Onclick closes the full-size
 * @param {Element} fullsize
 * @author Hanbit Chang
 */
function onClickCloseFullSize(fullsize) {
  onClickCloseBtnImgAdd(fullsize);
  onClickCloseBtnImg(fullsize);
}

/**
 * Adds an event listener to all elements with the ID "close-btn-img-add"
 * that, when clicked, clears the add task inputs, sets the checkboxes,
 * sets the assigned task, and hides the fullsize element.
 *
 * @param {HTMLElement} fullsize - The fullsize element to hide.
 * @return {Promise<void>} A promise that resolves when the event listener is added.
 */
function onClickCloseBtnImgAdd(fullsize) {
  const closeBtnAdds = document.querySelectorAll("#close-btn-img-add");
  closeBtnAdds.forEach((closeBtnAdd) => {
    closeBtnAdd.onclick = async () => {
      clearAddTaskInputs();
      setCheckBoxes();
      setAssignedAddTask();
      fullsize.classList.add("d-none");
    };
  });
}

/**
 * Adds an event listener to all elements with the ID "close-btn-img" that, when clicked,
 * hides the element with the class "d-none", retrieves the item data with the given ID and
 * content ID, and updates the "checked" property of each subtask in the item data based on
 * whether the corresponding checkbox is checked. Finally, it renders the close button
 * with the updated subtasks.
 *
 * @param {Element} fullsize - The element with the class "d-none" that will be hidden.
 * @return {Promise<void>} A promise that resolves when the function has completed.
 */
function onClickCloseBtnImg(fullsize) {
  const closeBtns = document.querySelectorAll("#close-btn-img");
  closeBtns.forEach((closeBtn) => {
    closeBtn.onclick = async () => {
      fullsize.classList.add("d-none");
      let itemData = await getItemById(id, contentId);
      let subtasks = itemData["subtasks"];
      for (let i = 0; i < subtasks.length; i++) {
        const check = document.getElementById(`subtask-${i}`);
        if (check.checked) subtasks[i]["checked"] = true;
        if (!check.checked) subtasks[i]["checked"] = false;
      }
      closeBtnRender(subtasks);
    };
  });
}

/**
 * Renders the close button after updating the subtask checks, resetting the priority, setting the assigned edit task,
 * setting the check boxes, rendering the boards, getting the event listeners, and getting the drop zones.
 *
 * @param {Array} subtasks - An array of subtask objects to update the checks for.
 * @return {Promise<void>} A promise that resolves when all the rendering and updating operations are complete.
 */
async function closeBtnRender(subtasks) {
  await updateSubtaskCheck(subtasks);
  resetPriority();
  setAssignedEditTask();
  setCheckBoxes();
  renderBoards(data);
  getEventListeners();
  getDropZones();
}

/**
 * Resets the priority by unchecking the radio buttons with IDs "radio-btn-3", "radio-btn-2", and "radio-btn-1".
 *
 * @return {void} This function does not return anything.
 */
function resetPriority() {
  const priority3 = document.getElementById("radio-btn-3");
  const priority2 = document.getElementById("radio-btn-2");
  const priority1 = document.getElementById("radio-btn-1");
  priority3.checked = false;
  priority2.checked = false;
  priority1.checked = false;
}

/**
 * Onclick gets add-task board
 * @param {Element} fullsize
 * @param {Element} board
 * @param {Element} editBoard
 * @param {Element} addBoard
 * @author Hanbit Chang
 */
function onClickAddTaskBoard(fullsize, board, editBoard, addBoard) {
  onClickToggleSelectBtn();
  onClickBoardHeaderAddBtn(fullsize, board, editBoard, addBoard);
  document.onclick = async (e) => {
    if (!e.target.closest("#select-btn-addCard") && !e.target.closest(".assigned-item")) {
      selectBtns.forEach((btns) => {
        btns.classList.remove("open");
      });
    }
  };
}

/**
 * Toggles the "open" class on the selected buttons when clicked.
 *
 * @return {void} No return value.
 */
function onClickToggleSelectBtn() {
  const selectBtns = document.querySelectorAll("#select-btn-addCard");
  selectBtns.forEach((btn) => {
    btn.onclick = () => {
      btn.classList.toggle("open");
    };
  });
}

/**
 * Attaches a click event listener to the add task button in the board header.
 * When clicked, it hides the fullsize, board, and editBoard elements, and
 * shows the addBoard element. It also sets the contentId to 1, calls the
 * onClickAddSubTasks function, gets the assigned users, sets the checkboxes,
 * and calls the oneCheckBox function.
 *
 * @param {HTMLElement} fullsize - The fullsize element.
 * @param {HTMLElement} board - The board element.
 * @param {HTMLElement} editBoard - The editBoard element.
 * @param {HTMLElement} addBoard - The addBoard element.
 * @return {void}
 */
function onClickBoardHeaderAddBtn(fullsize, board, editBoard, addBoard) {
  const addTaskBtn = document.querySelectorAll("#board-header-add-btn");
  addTaskBtn.forEach((btn) => {
    btn.onclick = () => {
      fullsize.classList.remove("d-none");
      board.classList.add("d-none");
      editBoard.classList.add("d-none");
      addBoard.classList.remove("d-none");
      contentId = 1;
      onClickAddSubTasks();
      getAddAssgined();
      setCheckBoxes();
      oneCheckBox();
    };
  });
}

/**
 * Sets the first checkbox with the id "radio-btn-5" as checked.
 * Adds an event listener to all checkboxes with the name "priority-button"
 * that unchecks all other checkboxes if one is checked.
 *
 * @return {void}
 */
function oneCheckBox() {
  const firstCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-5"]');
  firstCheckedBox.checked = true;
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="priority-button"]');
  checkboxes.forEach((checkbox) => {
    checkbox.onchange = function () {
      if (this.checked) {
        checkboxes.forEach((box) => {
          if (box !== this) box.checked = false;
        });
      }
    };
  });
}

/**
 * Adds a small task button to the board and opens the full-size container.
 *
 * @param {number} contentIdAdd - The ID of the content to add.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function addTaskBtnSmall(contentIdAdd) {
  if (window.innerWidth < 480) {
    changeHtmlPage("add_task.html");
  }
  const fullsize = document.getElementById("full-size-container");
  const board = document.getElementById("board");
  const editBoard = document.getElementById("edit-board");
  const addBoard = document.getElementById("add-board");
  contentId = contentIdAdd;
  fullsize.classList.remove("d-none");
  board.classList.add("d-none");
  editBoard.classList.add("d-none");
  addBoard.classList.remove("d-none");
  onClickAddSubTasks();
  getAddAssgined();
  setAddCard();
}

/**
 * Retrieves the assigned users for a specific task and updates the add card form with their names.
 *
 * @return {Promise<void>} A Promise that resolves when the assigned users have been retrieved and the add card form has been updated.
 * @author Hanbit Chang
 */
async function getAddAssgined() {
  let data = await getData("tasks");
  let contacts = await getData("contacts");
  let contactsData = [];
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i] != null) contactsData.push(contacts[i]);
  }
  let assignedUsers = [];
  for (let column of data) {
    if (column.id == contentId) {
      for (let item of column.items) {
        if (item.id == id) {
          for (i = 0; i < item["assigned"].length; i++) {
            assignedUsers.push(item["assigned"][i]["name"]);
          }
        }
      }
    }
  }
  getAssignedUsersAddCard(assignedUsers, contactsData);
}

/**
 * Generates the HTML list of contacts for the add card view, with checkboxes indicating which contacts are assigned.
 *
 * @param {Array} assignedUsers - An array of user names that are currently assigned to the task.
 * @param {Array} contacts - An array of contact objects, each containing a name and color property.
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function getAssignedUsersAddCard(assignedUsers, contacts) {
  getAssignedItem(assignedUsers, contacts);
  assignedItemEventListener(contacts);
}

/**
 * Asynchronously saves the added data by retrieving the "tasks" and "contacts" data from the server,
 * adding a new object to the items array of the content with the specified id, and then sending the updated data back to
 * the server. After the data is saved, the page is reloaded.
 *
 * @return {Promise<void>} A Promise that resolves when the data is saved and the page is reloaded.
 * @author Hanbit Chang
 */
async function saveAddData() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  if (contentId == undefined) contentId = 1;
  const content = data.find((content) => content.id == contentId);
  const obj = getAddObj(contacts);
  if (content.items == "") content.items = [];
  content.items.push(obj);
  const fullsize = document.getElementById("full-size-container");
  fullsize.classList.add("d-none");
  renderBoards(data);
  getEventListeners();
  getDropZones();
  setAddCard();
  await putData(`users/${actualUsersNumber}/tasks/`, data);
}

/**
 * Sets the add card by clearing the add task inputs, setting the checkboxes, and setting the assigned add task.
 *
 * @return {void}
 */
function setAddCard() {
  clearAddTaskInputs();
  setCheckBoxes();
  setAssignedAddTask();
}
