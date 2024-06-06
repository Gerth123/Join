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
  // clearBtn.addEventListener("click", () => {
  //   clearAddTaskInputs();
  //   setCheckBoxes();
  //   setAssignedAddTask();
  // });
}

// /**
//  * Clears the input fields and reset the state of the add task form.
//  *
//  * @return {void} This function does not return anything.
//  */
// function clearAddTaskInputs() {
//   const title = document.getElementById("title-addCard");
//   const description = document.getElementById("description-addCard");
//   const date = document.getElementById("date-addCard");
//   const categories = document.getElementById("add-task-categories");
//   const subtasksInput = document.getElementById("subtasks-input-addCard");
//   const subtasks = document.getElementById("subtasks-list-addCard");

//   title.value = "";
//   description.value = "";
//   date.value = "";
//   categories.value = "";
//   subtasksInput.value = "";
//   subtasks.innerHTML = "";
// }

// /**
//  * Resets the assigned users in the add task form by removing the "checked" class from all assigned items,
//  * clearing the assigned users container, and updating the assigned button text to "Select contacts to assign".
//  *
//  * @return {void} This function does not return anything.
//  */
// function setAssignedAddTask() {
//   const assignedUsers = document.getElementById("assigned-users-addCard");
//   const assignedItems = document.querySelectorAll(".assigned-item");
//   const assignedBtnText = document.querySelector(".btn-text-addCard");

//   assignedItems.forEach((item) => {
//     item.classList.remove("checked");
//   });
//   assignedUsers.innerHTML = "";
//   assignedBtnText.innerHTML = "Select contacts to assign";
// }

// /**
//  * Sets the initial state of the checkboxes for the priority buttons.
//  *
//  * This function finds the first, remove, and remove2 checkboxes by their IDs
//  * and sets their checked state. The first checkbox is checked, while the
//  * remove and remove2 checkboxes are unchecked.
//  *
//  * @return {void} This function does not return anything.
//  */
// function setCheckBoxes() {
//   const firstCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-5"]');
//   const removeCheckedBox = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-6"]');
//   const removeCheckedBox2 = document.querySelector('input[type="checkbox"][name="priority-button"][id="radio-btn-4"]');
//   firstCheckedBox.checked = true;
//   removeCheckedBox.checked = false;
//   removeCheckedBox2.checked = false;
// }

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
    // btn.addEventListener("click", (e) => {
    //   btn.classList.toggle("open");
    // });

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
    // checkbox.addEventListener("change", function () {
    //   if (this.checked) {
    //     checkboxes.forEach((box) => {
    //       if (box !== this) box.checked = false;
    //     });
    //   }
    // });

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
