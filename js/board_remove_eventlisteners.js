function removeEventListeners() {
  removeId(".clear-button");
  removeId(".board-card");
}

function removeId(id) {
  const boardCards = document.querySelectorAll(id);
  boardCards.forEach((boardCard) => {
    const boardCardClone = boardCard.cloneNode(true);
    boardCard.parentNode.replaceChild(boardCardClone, boardCard);
  });
}
