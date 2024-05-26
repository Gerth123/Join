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
  onClickAddCategory();
}
