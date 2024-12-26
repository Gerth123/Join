/**
 * Initializes the add task functionality by calling several functions.
 *
 * This function calls the following functions in order:
 * - onClickAddSubTasks() - Event listener for adding subtasks.
 * - getAddAssigned() - Retrieves assigned tasks.
 * - fillHeaderInitials() - Fills the header with initials.
 * - oneCheckBox() - Handles single checkbox selection.
 * - selectBtnEventListener() - Event listener for select button.
 */
function initAddTask() {
  checkUserLogin();
  onClickAddSubTasks();
  onClickSelectBtn();
  onClickClearBtn();
  getAddAssigned();
  fillHeaderInitials();
  oneCheckBox();
}

/**
 * Attaches a click event listener to the "clear-button" element and clears the input fields and sets the checkboxes to unchecked.
 *
 * @return {void} This function does not return anything.
 */
function onClickClearBtn() {
  const clearBtn = document.getElementById("clear-button");
  clearBtn.onclick = () => {
    clearAddTaskInputs();
    setCheckBoxes();
    setAssignedAddTask();
  };
}

/**
 * Attaches a click event listener to each element with the ID "select-btn-addCard" and toggles the "open" class on the clicked element.
 * Additionally, attaches a click event listener to the document that removes the "open" class from all elements with the ID "select-btn-addCard"
 * if the click event target is not within an element with the ID "select-btn-addCard" or an element with the class "assigned-item".
 *
 * @return {void} This function does not return anything.
 */
function onClickSelectBtn() {
  const selectBtns = document.querySelectorAll("#select-btn-addCard");
  selectBtns.forEach((btn) => {
    btn.onclick = () => {
      btn.classList.toggle("open");
    };
  });

  document.onclick = function (event) {
    if (!event.target.closest("#select-btn-addCard") && !event.target.closest(".assigned-item")) {
      selectBtns.forEach((btns) => {
        btns.classList.remove("open");
      });
    }
  };
}

/**
 * Sets the first checkbox with the id "radio-btn-5" as checked.
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
 * Saves the data of the added task and changes the HTML page to "board.html".
 */
async function saveAddTaskData() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userData = await loadDataBackend(`api/users/profiles/${user.user_id}/`);
  let contacts = userData.contacts;
  if (contentId == undefined) contentId = 1;
  const obj = getAddObj(contacts);
  postDataBackend("api/tasks/", obj);
  changeHtmlPage("board.html");
}



