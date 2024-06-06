/**
 * Attaches a keydown event listener to the search input element and performs a search on the board cards.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function searchCard() {
  const search = document.getElementById("board-header-search-input");
  const boardCards = document.querySelectorAll(".board-card");
  // search.addEventListener("keydown", () => {
  //   let serachValue = search.value.toLowerCase();
  //   if (search.value.length > 1) {
  //     boardCards.forEach((boardCard) => {
  //       const title = boardCard.querySelector(".board-title");
  //       let titleValue = title.innerHTML.toLowerCase();
  //       if (!titleValue.includes(serachValue)) {
  //         setNoResults(boardCard);
  //       }
  //     });
  //   } else {
  //     boardCards.forEach((boardCard) => {
  //       boardCard.classList.remove("d-none");
  //       const boardCardContent = document.querySelectorAll(".board-card-content");
  //       boardCardContent.forEach((content) => {
  //         content.classList.remove("d-none");
  //       });
  //       const noSearchResults = document.getElementById("no-search-results");
  //       noSearchResults.classList.add("d-none");
  //     });
  //   }
  // });

  search.onkeydown = () => {
    let serachValue = search.value.toLowerCase();
    if (search.value.length > 1) {
      boardCards.forEach((boardCard) => {
        const title = boardCard.querySelector(".board-title");
        const document = boardCard.querySelector(".board-description");
        let titleValue = title.innerHTML.toLowerCase();
        let documentValue = document.innerHTML.toLowerCase();
        if (!titleValue.includes(serachValue) && !documentValue.includes(serachValue)) {
          setNoResults(boardCard);
        }
      });
    } else {
      boardCards.forEach((boardCard) => {
        boardCard.classList.remove("d-none");
        const boardCardContent = document.querySelectorAll(".board-card-content");
        boardCardContent.forEach((content) => {
          content.classList.remove("d-none");
        });
        const noSearchResults = document.getElementById("no-search-results");
        noSearchResults.classList.add("d-none");
      });
    }
  };
}

/**
 * Sets the given board card element to be hidden and hides all "no content" images.
 * If all board cards are hidden, hides all board card content and shows the "no search results" element.
 *
 * @param {Element} boardCard - The board card element to be hidden.
 * @return {void} This function does not return anything.
 */
function setNoResults(boardCard) {
  boardCard.classList.add("d-none");
  const noContentImg = document.querySelectorAll("#no-content-img");
  noContentImg.forEach((img) => {
    img.classList.add("d-none");
  });
  const checkBoardCard = document.querySelectorAll(".board-card");
  const boardCardDnone = document.querySelectorAll(".board-card.d-none");
  if (checkBoardCard.length == boardCardDnone.length) {
    const boardCardContent = document.querySelectorAll(".board-card-content");
    boardCardContent.forEach((content) => {
      content.classList.add("d-none");
    });
    const noSearchResults = document.getElementById("no-search-results");
    noSearchResults.classList.remove("d-none");
  }
}
