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
  const json = localStorage.getItem("board-data");
  if (!json) return emptyData;
  return JSON.parse(json);
}

function setFireBaseType(type) {
  if (type == "") {
    type = [];
  }
}

function setFireBaseToEmpty(type) {
  if (type.length == 0) {
    type = "";
  }
}
