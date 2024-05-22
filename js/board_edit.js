async function getEditBoard(id, contentId) {
  const title = document.querySelector("input[id=title-editCard]");
  const description = document.querySelector("input[id=description-editCard]");
  const date = document.querySelector("input[id=date-editCard]");
  let itemData = await getItemById(id, contentId);
  title.value = `${itemData["title"]}`;
  description.value = `${itemData["description"]}`;
  date.value = `${itemData["date"]}`;
  toggleSelectBtn();
  getEditPriority(itemData["priority"]);
  getEditSubtasks(itemData["subtasks"]);
  await getEditAssigned();
  getSubtasksEventListeners();
  getEditDate(itemData["date"]);
}

function toggleSelectBtn() {
  const selectBtns = document.querySelectorAll("#select-btn-editCard");
  selectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("open");
    });
  });
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

function getCheckedUsers(assignedUsers, contactName) {
  for (const userName of assignedUsers) {
    if (userName == contactName) {
      return "checked";
    }
  }
}

async function getEditAssigned() {
  let contacts = await getData("contacts");
  let data = await getData("tasks");
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
  getEditContacts(assignedUsers, contacts);
  toggleCheckUsers(contacts);
}

function getEditContacts(assignedUsers, contacts) {
  const contactList = document.getElementById("assigned-list-items");
  contactList.innerHTML = "";
  contacts.forEach((contact) => {
    let name = getInitials(contact["name"]);
    contactList.innerHTML += /*html*/ `
      <li class="assigned-item ${getCheckedUsers(assignedUsers, contact["name"])}">
        <div class="assigned-user">
          <div id="board-user" class="board-user" style="background-color:${contact["color"]}">${name}</div>
          <span class="item-text">${contact["name"]}</span>
        </div>
        <div class="check-img"></div>
      </li>`;
  });
}

function toggleCheckUsers(contacts) {
  const assignedItems = document.querySelectorAll(".assigned-item");
  assignedItems.forEach((item) => {
    checkUsers(contacts);
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      checkUsers(contacts);
    });
  });
}

function checkUsers(contacts) {
  const checked = document.querySelectorAll(".checked");
  const btnText = document.querySelector(".btn-text");
  const checkedUsers = document.getElementById("assigned-users-editCard");
  const userNames = document.querySelectorAll(".checked .item-text");
  if (checked && checked.length > 0) {
    btnText.innerText = `${checked.length} Selected`;
    checkedUsers.innerHTML = "";
    userNames.forEach((userName) => {
      const personWithName = contacts.find((person) => person.name == userName.innerHTML);
      if (personWithName) {
        let name = getInitials(personWithName["name"]);
        checkedUsers.innerHTML += getEditAssignedUser(personWithName["color"], name);
      }
    });
  } else {
    btnText.innerText = "Select contacts to assign";
    checkedUsers.innerHTML = "";
  }
}

function getEditAssignedUser(color, name) {
  return /*html*/ `
  <div class="assigned-user">
    <div id="board-user" class="board-user-editCard" style="background-color: ${color}">${name}</div>
  </div>
  `;
}

function getInitials(name) {
  let words = name.split(" ");
  let initials = "";
  for (let word of words) {
    initials += word[0].toUpperCase();
  }
  return initials;
}

function getEditSubtasks(subtasks) {
  const list = document.getElementById("subtasks-list");
  list.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    list.innerHTML += getEditSubtasksList(subtasks[i]["task"]);
  }
}

function getEditSubtasksList(task) {
  return /*html*/ `
  <li id="subtasks-li">
    <div class="subtasks-li-container">
      <p class="subtasks-li-text" contenteditable=false>${task}</p>
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

function onClickTrash() {
  const trashes = document.querySelectorAll("#subtasks-trash");
  trashes.forEach((trash) => {
    trash.addEventListener("click", () => {
      let parentLi = trash.closest("#subtasks-li");
      if (parentLi) {
        parentLi.remove();
      }
    });
  });
}

function onClickEditing() {
  const edits = document.querySelectorAll("#subtasks-edit");
  edits.forEach((edit) => {
    edit.addEventListener("click", () => {
      const parentContent = edit.closest(".subtasks-li-container");
      const subtaskElement = parentContent.querySelector(".subtasks-li-text");
      const subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      const subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.add("d-none");
      subtaskSecondBtns.classList.remove("d-none");
      subtaskElement.contentEditable = true;
    });
  });
}

function onClickChecker() {
  const checkers = document.querySelectorAll("#subtasks-checker");
  checkers.forEach((checker) => {
    checker.addEventListener("click", () => {
      const parentContent = checker.closest(".subtasks-li-container");
      const subtaskElement = parentContent.querySelector(".subtasks-li-text");
      const subtaskFirstBtns = parentContent.querySelector("#subtask-first-btns");
      const subtaskSecondBtns = parentContent.querySelector("#subtask-second-btns");
      subtaskFirstBtns.classList.remove("d-none");
      subtaskSecondBtns.classList.add("d-none");
      subtaskElement.contentEditable = false;
    });
  });
}

function getSubtasksEventListeners() {
  onClickTrash();
  onClickEditing();
  onClickChecker();
}

function getEditDate(date) {
  const dateData = document.getElementById("date-editCard");
  dateData.min = new Date().toISOString().split("T")[0];
  dateData.value = date;
}

let show = true;

function showCheckboxes() {
  const checkboxes = document.getElementById("checkBoxes");
  if (show) {
    checkboxes.style.display = "block";
    show = false;
  } else {
    checkboxes.style.display = "none";
    show = true;
  }
}

async function getData(data) {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let fulldata = await loadData("users");
  return fulldata[actualUsersNumber][data];
}
