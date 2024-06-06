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

async function saveAddTaskData() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let data = await getData("tasks");
  let contacts = await getData("contacts");
  if (contentId == undefined) contentId = 1;
  const content = data.find((content) => content.id == contentId);
  const obj = getAddObj(contacts);
  if (content.items == "") content.items = [];
  content.items.push(obj);
  await putData(`users/${actualUsersNumber}/tasks/`, data);
  changeHtmlPage("board.html");
}
