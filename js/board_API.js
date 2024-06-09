/**
 * Saves the data in the server.
 * @param {Object} data - saves the board data
 *
 * @author Hanbit Chang
 */
function save(data) {
  localStorage.setItem("board-data", JSON.stringify(data));
}

/**
 * Reads the data in the server.
 *
 * @author Hanbit Chang
 */
function read() {
  const json = localStorage.getItem("board-data");
  if (!json) return emptyData;
  return JSON.parse(json);
}
