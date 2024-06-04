/**
 * Initializes the add task functionality by calling several functions.
 *
 * This function calls the following functions in order:
 * - onClickAddSubTasks() - Event listener for adding subtasks.
 * - getAddAssgined() - Retrieves assigned tasks.
 * - fillHeaderInitials() - Fills the header with initials.
 * - oneCheckBox() - Handles single checkbox selection.
 * - selectBtnEventListener() - Event listener for select button.
 */
function initAddTask() {
  onClickAddSubTasks();
  onClickSelectBtn();
  onClickClearBtn();
  getAddAssgined();
  fillHeaderInitials();
  oneCheckBox();
}

function onClickClearBtn() {
  const clearBtn = document.getElementById("clear-button");

  clearBtn.addEventListener("click", () => {
    clearAddTaskInputs();
    setCheckBoxes();
  });
}

/**
 * Clears the input fields and reset the state of the add task form.
 *
 * @return {void} This function does not return anything.
 */

function clearAddTaskInputs() {
  const title = document.getElementById("title-addCard");
  const description = document.getElementById("description-addCard");
  const date = document.getElementById("date-addCard");
  const categories = document.getElementById("add-task-categories");
  const subtasksInput = document.getElementById("subtasks-input-addCard");
  const subtasks = document.getElementById("subtasks-list-addCard");
  const assignedUsers = document.getElementById("assigned-users-addCard");
  const assignedItems = document.querySelectorAll(".assigned-item");
  const assignedBtnText = document.querySelector(".btn-text-addCard");

  assignedItems.forEach((item) => {
    item.classList.remove("checked");
  });
  assignedUsers.innerHTML = "";
  assignedBtnText.innerHTML = "Select contacts to assign";
  title.value = "";
  description.value = "";
  date.value = "";
  categories.value = "";
  subtasksInput.value = "";
  subtasks.innerHTML = "";
}

function setCheckBoxes() {
  const firstCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-5"]');
  const removeCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-6"]');
  const removeCheckedBox2 = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-4"]');
  firstCheckedBox.checked = true;
  removeCheckedBox.checked = false;
  removeCheckedBox2.checked = false;
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
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("open");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#select-btn-addCard") && !e.target.closest(".assigned-item")) {
      selectBtns.forEach((btns) => {
        btns.classList.remove("open");
      });
    }
  });
}

function oneCheckBox() {
  const firstCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-5"]');
  firstCheckedBox.checked = true;
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="priority-button"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      8;
      if (this.checked) {
        checkboxes.forEach((box) => {
          if (box !== this) {
            box.checked = false;
          }
        });
      }
    });
  });
}
