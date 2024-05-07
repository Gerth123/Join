function getEditBoard(id, contentId) {
  console.log(id, contentId);
  let itemData = getItemById(id, contentId);
  let title = document.querySelector("input[id=title]");
  title.value = `${itemData["title"]}`;
  let description = document.querySelector("input[id=description]");
  description.value = `${itemData["description"]}`;
  let date = document.querySelector("input[id=date]");
  date.value = `${itemData["date"]}`;
  getEditPriority(itemData["priority"]);
  getEditSubtasks(itemData["subtasks"]);
  getEditEventListeners();
}

function getEditPriority(priority) {
  if (priority == "urgent") {
    let urgentBtn = document.querySelector("#radio-btn-3");
    urgentBtn.checked = true;
  }
  if (priority == "medium") {
    let mediumBtn = document.querySelector("#radio-btn-2");
    mediumBtn.checked = true;
  }
  if (priority == "low") {
    let lowBtn = document.querySelector("#radio-btn-1");
    lowBtn.checked = true;
  }
}

function getEditAssigned() {
  /**todo */
}

function getEditSubtasks(subtasks) {
  let list = document.getElementById("subtasks-list");
  list.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    list.innerHTML += /*html*/ `
    <li class="subtasks-li-container" >
      <div class="subtasks-li" contenteditable=false>
        ${subtasks[i]["task"]}
      </div>
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
    </li>
    `;
  }
}

// function deleteSubtask(i) {
//   let del = document.getElementById(`subtasks-trash-${i}`);
//   console.log(del);
// }

// function editSubtask(i) {
//   let edit = document.getElementById(`subtasks-edit-${i}`);
//   console.log(edit);
// }

function getEditEventListeners() {
  let trashes = document.querySelectorAll("#subtasks-trash");
  trashes.forEach((trash) => {
    trash.addEventListener("click", () => {
      let parentLi = trash.closest(".subtasks-li-container");
      if (parentLi) {
        parentLi.remove();
      }
    });
  });

  let edits = document.querySelectorAll("#subtasks-edit");
  edits.forEach((edit) => {
    edit.addEventListener("click", () => {
      let parentContent = edit.closest(".subtasks-li-container");
      let subtaskElement = parentContent.querySelector(".subtasks-li");
      let subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      let subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.add("d-none");
      subtaskSecondBtns.classList.remove("d-none");
      subtaskElement.contentEditable = true;
    });
  });

  let checkers = document.querySelectorAll("#subtasks-checker");
  checkers.forEach((checker) => {
    checker.addEventListener("click", () => {
      let parentContent = checker.closest(".subtasks-li-container");
      let subtaskElement = parentContent.querySelector(".subtasks-li");
      let subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      let subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.remove("d-none");
      subtaskSecondBtns.classList.add("d-none");
      subtaskElement.contentEditable = false;
    });
  });
}
