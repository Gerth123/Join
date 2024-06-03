// async function saveaddCardData() {
//   console.log("working");
// }

function initAddTask() {
  const selectBtns = document.querySelectorAll("#select-btn-addCard");
  selectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("open");
    });
  });
  onClickAddSubTasks();
  getAddAssgined();
  fillHeaderInitials();
  oneCheckBox();
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
