// async function saveaddCardData() {
//   console.log("working");
// }

function initAddTask() {
  const selectBtns = document.querySelector("#select-btn-addCard");
  selectBtns.addEventListener("click", (e) => {
    selectBtns.classList.toggle("open");
  });
}
