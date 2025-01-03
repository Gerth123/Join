/**
 * This function is used onload of the body of the summary HTML page. It gets the number of the user from the link and shares it with the fillDates functions. 
 * The function also uses the function loadData to load the data from the Backend.
 * 
 * @author: Robin
 */
async function initSummary() {
  checkUserLogin();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  await fillDates(actualUser);
  await checkConditions();
  await fillHeaderInitials();
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
   * This function is used to check the mediaQuery and the referrer. If the mediaQuery matches and the referrer contains login.html, 
   * the showGreetingThenMain function is called. Otherwise, the mainContainer is shown.
   * 
   * @author: Robin
   */
async function checkConditions() {
  var mediaQuery = window.matchMedia("(max-width: 1100px)");
  var referrer = document.referrer;
  if (mediaQuery.matches && referrer.includes("login.html")) {
    await showGreetingThenMain();
  } else {
    let mainContainer = document.getElementById('headingSectionAndMainContainer');
    mainContainer.style.display = 'flex';
  }
}

/**
 * This function is used to show the greeting and then the mainContainer.
 * 
 * @author: Robin
 */

function showGreetingThenMain() {
  let greetingContainer = document.getElementById('greetingContainer');
  let mainContainer = document.getElementById('headingSectionAndMainContainer');
  mainContainer.style.display = 'none';
  greetingContainer.style.display = 'flex';
  setTimeout(function () {
    greetingContainer.style.display = 'none';
    mainContainer.style.display = 'flex';
  }, 2000);
}

/**
 * This function is used to fill the content of the summary page.
 *
 * @param {number} actualUsersNumber - The number of the user.
 * @param {array} actualUsers - The array of the users.
 *
 * @author: Robin
 */
async function fillDates(user) {
  let actualUser = await loadDataBackend(`api/users/profiles/${user.user_id}/`);
  getElementById("greetingName").innerHTML = `${actualUser.username}`;
  getElementById("tasksToDo").innerHTML = `${checkTasksCount(actualUser.tasks, 0)}`;
  getElementById("tasksDone").innerHTML = `${checkTasksCount(actualUser.tasks, 3)}`;
  getElementById("tasksInBoard").innerHTML = `${actualUser.tasks.length}`;
  getElementById("tasksInProgress").innerHTML = `${checkTasksCount(actualUser.tasks, 1)}`;
  getElementById("tasksAwaitingFeedback").innerHTML = `${checkTasksCount(actualUser.tasks, 2)}`;
  let urgentDates = [];
  fillUrgentTask(actualUser.tasks, urgentDates);
  fillUrgentDate(urgentDates);
}

/**
 * This function is used to get the number of the tasks to do.
 * 
 * @param {array} tasks - The array of the tasks.
 * @return {number} - The number of the tasks to do.
 */
function checkTasksCount(tasks, status) {
  let tasksToDo = 0;
  tasks.forEach(task => {
    if (task.status === status) {
      tasksToDo++;
    }
  });
  return tasksToDo;
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
function fillUrgentTask(tasks, urgentDates) {
  let urgentTasksNumber = 0;
  tasks.forEach(task => {
    if (task.priority === "urgent") {
      urgentDates.push(task.date);
      urgentTasksNumber++;
    }
  });
  const urgentTasksElement = document.getElementById("urgentTasks");
  if (urgentTasksElement) {
    urgentTasksElement.innerHTML = `${urgentTasksNumber}`;
  } else {
    console.error("Element with ID 'urgentTasks' not found.");
  }
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


