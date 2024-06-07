/**
 * Attaches a keydown event listener to the search input element and performs a search on the board cards.
 *
 * @return {void} This function does not return anything.
 * @author Hanbit Chang
 */
function searchCard() {
  const search = document.getElementById("board-header-search-input");
  const boardCards = document.querySelectorAll(".board-card");
  search.onkeydown = () => {
    let searchValue = search.value.toLowerCase();
    if (search.value.length > 1) searchByTitleAndDescription(boardCards, searchValue);
    else searchRender(boardCards);
  };
}

/**
 * Renders the board cards by removing the "d-none" class from each board card and its content,
 * and hiding the "no-search-results" element.
 *
 * @param {NodeList} boardCards - A list of board card elements.
 * @return {void} This function does not return anything.
 */
function searchRender(boardCards) {
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

/**
 * Searches for board cards by title and description.
 *
 * @param {NodeList} boardCards - The list of board cards to search.
 * @param {string} searchValue - The search value to look for.
 * @return {void} This function does not return anything.
 */
function searchByTitleAndDescription(boardCards, searchValue) {
  boardCards.forEach((boardCard) => {
    const title = boardCard.querySelector(".board-title");
    const document = boardCard.querySelector(".board-description");
    let titleValue = title.innerHTML.toLowerCase();
    let documentValue = document.innerHTML.toLowerCase();
    if (!titleValue.includes(searchValue) && !documentValue.includes(searchValue)) {
      setNoResults(boardCard);
    }
  });
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
  getNoResults();
}

/**
 * Retrieves all board cards and checks if all of them are hidden. If so, hides all board card content and shows the "no search results" element.
 *
 * @return {void} This function does not return anything.
 */
function getNoResults() {
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
