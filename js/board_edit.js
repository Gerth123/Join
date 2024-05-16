async function getEditBoard(id, contentId) {
  console.log(id, contentId);
  let itemData = getItemById(id, contentId);
  let title = document.querySelector("input[id=title-editCard]");
  title.value = `${itemData["title"]}`;
  let description = document.querySelector("input[id=description-editCard]");
  description.value = `${itemData["description"]}`;
  let date = document.querySelector("input[id=date-editCard]");
  date.value = `${itemData["date"]}`;
  getEditPriority(itemData["priority"]);
  getEditSubtasks(itemData["subtasks"]);
  await getEditAssigned();
  getSubtasksEventListeners();
  getEditDate(itemData["date"]);
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

async function getEditAssigned() {
  /**todo */
  let response = await fetch("/assets/data/join-ca44d-default-rtdb-export.json");
  let dataString = await response.json();
  let contactList = document.getElementById("assigned-list-items");
  let contacts = dataString["users"][0]["contacts"];
  console.log(contactList);
  contactList.innerHTML = "";
  contacts.forEach((contact) => {
    contactList.innerHTML += /*html*/ `
      <li class="assigned-item">
        <div class="assigned-user">
          <div id="board-user" class="board-user" style="background-color:${contact["color"]}">HC</div>
          <span class="item-text">${contact["name"]}</span>
        </div>
        <div class="check-img"></div>
      </li>
    `;
  });

  const selectBtn = document.querySelector(".select-btn");
  const assignedItems = document.querySelectorAll(".assigned-item");

  selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
  });

  assignedItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");

      let checked = document.querySelectorAll(".checked"),
        btnText = document.querySelector(".btn-text");

      console.log(checked);
      if (checked && checked.length > 0) {
        btnText.innerText = `${checked.length} Selected`;
      } else {
        btnText.innerText = "Select contacts to assign";
      }
    });
  });
}

function getEditSubtasks(subtasks) {
  let list = document.getElementById("subtasks-list");
  list.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    list.innerHTML += /*html*/ `
    <li id="subtasks-li">
      <div class="subtasks-li-container">
        <p class="subtasks-li-text" contenteditable=false>${subtasks[i]["task"]}</p>
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
    </li>
    `;
  }
}

function getSubtasksEventListeners() {
  let trashes = document.querySelectorAll("#subtasks-trash");
  trashes.forEach((trash) => {
    trash.addEventListener("click", () => {
      let parentLi = trash.closest("#subtasks-li");
      if (parentLi) {
        parentLi.remove();
      }
    });
  });

  let edits = document.querySelectorAll("#subtasks-edit");
  console.log(edits);
  edits.forEach((edit) => {
    edit.addEventListener("click", () => {
      let parentContent = edit.closest(".subtasks-li-container");
      let subtaskElement = parentContent.querySelector(".subtasks-li-text");
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
      let subtaskElement = parentContent.querySelector(".subtasks-li-text");
      let subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      let subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.remove("d-none");
      subtaskSecondBtns.classList.add("d-none");
      subtaskElement.contentEditable = false;
    });
  });
}

function getEditDate(date) {
  let dateData = document.getElementById("date-editCard");
  dateData.min = new Date().toISOString().split("T")[0];
  dateData.value = date;
  console.log("this is date", dateData.value);
}

let show = true;

function showCheckboxes() {
  let checkboxes = document.getElementById("checkBoxes");
  if (show) {
    checkboxes.style.display = "block";
    show = false;
  } else {
    checkboxes.style.display = "none";
    show = true;
  }
}
