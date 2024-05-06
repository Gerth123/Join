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
  subtasks.forEach((task) => {
    list.innerHTML += /*html*/ `
    <li>${task["task"]}</li>
    `;
  });
}
