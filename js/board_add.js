/**
 * Checks the subtasks
 */
function checkAddSubtasks() {
  const list = document.getElementById("subtasks-list-addCard");
  const subtaskInput = document.getElementById("subtasks-input-addCard");
  const subtaskAddBtn = document.getElementById("subtasks-add-addCard");
  const subtaskContainer = document.getElementById("subtasks-btn-container-addCard");
  list.innerHTML += getAddSubtaskListHTML(subtaskInput.value);
  subtaskInput.value = "";
  subtaskContainer.classList.add("d-none");
  subtaskAddBtn.classList.remove("d-none");
  getSubtasksEventListeners();
}

/**
 * Returns the html of subtask list
 * @param {string} subtaskInputValue
 * @returns html code
 */
function getAddSubtaskListHTML(subtaskInputValue) {
  return /*html*/ `
  <li id="subtasks-li">
    <div class="subtasks-li-container">
      <p class="subtasks-li-text" contenteditable=false>${subtaskInputValue}</p>
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
  </li>`;
}
