/**
 * This function is used onload of the body of the summary HTML page. It gets the number of the user from the link and shares it with the fillDates functions. 
 * The function also uses the function loadData to load the data from the remoteStorage (Firebase).
 * 
 * @author: Robin
 */
async function initSummary() {
  let urlParams = new URLSearchParams(window.location.search);
  let actualUsersNumber = urlParams.get("actualUsersNumber");
  let actualUsers = await loadData("users");
  fillDates(actualUsersNumber, actualUsers);
}

/** 
 * Generates a greeting message based on the current time:
 * - 'Good morning' before 12 PM,
 * - 'Good afternoon' between 12 PM and 6 PM,
 * - 'Good evening' otherwise.
 * Displays the greeting in an element with id 'greetingText'.
 * 
 * Author: Elias
 */
document.addEventListener("DOMContentLoaded", function () {
  let today = new Date();
  let curHr = today.getHours();
  let greeting;

  if (curHr < 12) {
    greeting = "Good morning,";
  } else if (curHr < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }
  document.getElementById("greetingText").textContent = greeting;
});

/**
 * This function is used to fill the content of the summary page.
 *
 * @param {number} actualUsersNumber - The number of the user.
 * @param {array} actualUsers - The array of the users.
 *
 * @author: Robin
 */
function fillDates(actualUsersNumber, actualUsers) {
  let actualUser = actualUsers[actualUsersNumber];
  getElementById("tasksToDo").innerHTML = `${actualUser["tasks"][0]["items"].length}`;
  getElementById("tasksDone").innerHTML = `${actualUser["tasks"][3]["items"].length}`;
  getElementById("tasksInBoard").innerHTML = `${actualUser["tasks"].length}`;
  getElementById("tasksInProgress").innerHTML = `${actualUser["tasks"][1]["items"].length}`;
  getElementById("tasksAwaitingFeedback").innerHTML = `${actualUser["tasks"][2]["items"].length}`;
  let urgentDates = [];
  fillUrgentTask(actualUser, urgentDates);
  fillUrgentDate(urgentDates);
  getElementById("greetingName").innerHTML = `${actualUsers[actualUsersNumber]["name"]}`;
}

/**
 * This function is used to shortcut the getElementById function.
 *
 * @param {string} id - The id of the element.
 *
 * @author: Robin
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * This function is used to fill the number of the urgent tasks.
 *
 * @param {object} actualUser - The object of the user.
 * @param {array} urgentDates - The array of the urgent dates.
 *
 * @author: Robin
 */
function fillUrgentTask(actualUser, urgentDates) {
  let urgentTasksNumber = 0;
  for (let actualTasksStatusIndex = 0; actualTasksStatusIndex < actualUser["tasks"].length; actualTasksStatusIndex++) {
    let actualTasksStatusNumber = actualUser["tasks"][actualTasksStatusIndex];
    for (let actualTaskIndex = 0; actualTaskIndex < actualTasksStatusNumber["items"].length; actualTaskIndex++) {
      let actualTaskPriority = actualTasksStatusNumber["items"][actualTaskIndex]["priority"];
      if (actualTaskPriority === "urgent") {
        urgentDates.push(actualTasksStatusNumber["items"][actualTaskIndex]["date"]);
        urgentTasksNumber++;
      }
    }
  }
  getElementById("urgentTasks").innerHTML = `${urgentTasksNumber}`;
}

/**
 * This function is used to fill the date of the urgent task, that is the closest in time.
 *
 * @param {array} urgentDates - The array of the urgent dates.
 *
 * @author: Robin
 */
function fillUrgentDate(urgentDates) {
  let dateInMilliseconds = urgentDates.map((date) => new Date(date).getTime());
  let earliestDateInMilliseconds = Math.min(...dateInMilliseconds);
  let earliestDate = new Date(earliestDateInMilliseconds);
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthName = months[earliestDate.getMonth()];
  let day = earliestDate.getDate();
  let year = earliestDate.getFullYear();
  let formattedDate = `${monthName} ${day}, ${year}`;
  getElementById("urgentDate").innerHTML = formattedDate;
}
