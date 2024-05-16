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

    if (checked && checked.length > 0) {
      btnText.innerText = `${checked.length} Selected`;
    } else {
      btnText.innerText = "Select contacts to assign";
    }
  });
});
