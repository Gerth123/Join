/**
 * Saves the data in the server.
 * @param {Object} data - saves the board data
 */
function save(data) {
  localStorage.setItem("board-data", JSON.stringify(data));
}

/**
 * Reads the data in the server.
 */
function read() {
  // let urlParams = new URLSearchParams(window.location.search);
  // let actualUsersNumber = urlParams.get("actualUsersNumber");
  // console.log("actualUsersNumber", actualUsersNumber);
  const json = localStorage.getItem("board-data");
  if (!json) return emptyData;
  return JSON.parse(json);
}
