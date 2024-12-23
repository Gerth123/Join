// let colors = [
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
//   generateRandomColor(),
// ];

/**
 * This variable contains the data for the contacts that automatically appear in the contacts HTML.
 *
 * @author Robin
 */
// let testContacts = [
//   {
//     name: "Anton Mayer",
//     email: "antom@gmail.com",
//     phone: "+491234567890",
//     color: colors[0],
//   },
//   {
//     name: "Hans Mueller",
//     email: "hans@gmail.com",
//     phone: "+491234567890",
//     color: colors[1],
//   },
//   {
//     name: "Benedikt Ziegler",
//     email: "benedikt@gmail.com",
//     phone: "+491234567890",
//     color: colors[2],
//   },
//   {
//     name: "David Eisenberg",
//     email: "davidberg@gmail.com",
//     phone: "+491234567890",
//     color: colors[3],
//   },
//   {
//     name: "Eva Fischer",
//     email: "eva@gmail.com",
//     phone: "+491234567890",
//     color: colors[4],
//   },
//   {
//     name: "Emmanuel Mauer",
//     email: "emmanuelma@gmail.com",
//     phone: "+491234567890",
//     color: colors[5],
//   },
//   {
//     name: "Marcel Bauer",
//     email: "bauer@gmail.com",
//     phone: "+491234567890",
//     color: colors[6],
//   },
//   {
//     name: "Tatjana Wolf",
//     email: "wolf@gmail.com",
//     phone: "+491234567890",
//     color: colors[7],
//   },
//   {
//     name: "Klaus Werner",
//     email: "klausw@gmail.com",
//     phone: "+491234567890",
//     color: colors[8],
//   },
//   {
//     name: "Peter Hahn",
//     email: "peterhahn@gmail.com",
//     phone: "+491234567890",
//     color: colors[9],
//   },
//   {
//     name: "Stefan Meier",
//     email: "stefanMeier@gmail.com",
//     phone: "+491213212390",
//     color: colors[10],
//   },
// ];

/**
 * This variable contains the data for the tasks that automatically appear in the tasks HTML.
 *
 * @author Robin
 */
// let testTasks = [
//   {
//     id: 1,
//     items: [
//       {
//         id: 7955,
//         category: "user story",
//         title: "Kochwelt Page & Recipe Recommender",
//         description: "Build start page with recipe recommendation.",
//         assigned: [
//           { color: colors[5], name: "Emmanuel Mauer" },
//           { color: colors[6], name: "Marcel Bauer" },
//           { color: colors[7], name: "Tatjana Wolf" },
//         ],
//         date: "2024-06-15",
//         priority: "medium",
//         subtasks: [
//           { checked: false, task: "Implement Recipe Recommendation" },
//           { checked: true, task: "Start Page Layout" },
//         ],
//       },
//       {
//         id: 2453,
//         category: "technical task",
//         title: "HTML Base Template Creation",
//         description: "Create reusable HTML base templates...",
//         assigned: [
//           { color: colors[3], name: "David Eisenberg" },
//           { color: colors[2], name: "Benedikt Ziegler" },
//           { color: colors[0], name: "Anton Mayer" },
//         ],
//         date: "2024-06-15",
//         priority: "low",
//         subtasks: [
//           { checked: false, task: "Implement Recipe Recommendation" },
//           { checked: true, task: "Start Page Layout" },
//         ],
//       },
//       {
//         id: 8945,
//         category: "user story",
//         title: "Daily Kochwelt Recipe",
//         description: "Implement daily recipe and portion calculator...",
//         assigned: [
//           { color: colors[5], name: "Emmanuel Mauer" },
//           { color: colors[0], name: "Anton Mayer" },
//           { color: colors[7], name: "Tatjana Wolf" },
//         ],
//         date: "2024-06-15",
//         priority: "medium",
//         subtasks: [
//           { checked: false, task: "Implement Recipe Recommendation" },
//           { checked: true, task: "Start Page Layout" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     items: [
//       {
//         id: 7489,
//         category: "technical task",
//         title: "CSS Architecture Planning",
//         description: "Define CSS naming conventions and structure...",
//         assigned: [
//           { color: colors[10], name: "Stefan Meier" },
//           { color: colors[2], name: "Benedikt Ziegler" },
//         ],
//         date: "2024-06-15",
//         priority: "urgent",
//         subtasks: [
//           { checked: false, task: "Implement Recipe Recommendation" },
//           { checked: true, task: "Start Page Layout" },
//         ],
//       },
//       {
//         id: 9876,
//         category: "technical task",
//         title: "Fix Responsive Layout Issues",
//         description: "Resolve layout issues on mobile devices.",
//         assigned: [
//           { color: colors[10], name: "Stefan Meier" },
//           { color: colors[3], name: "David Eisenberg" },
//         ],
//         date: "2024-06-15",
//         priority: "urgent",
//         subtasks: [
//           { checked: false, task: "Identify Issues" },
//           { checked: false, task: "Fix CSS Bugs" },
//           { checked: false, task: "Test on Devices" },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     items: "",
//   },
//   {
//     id: 4,
//     items: "",
//   },
// ];

/**
 * This function generates a random color and returns it.
 *
 * @author: Robin
 */
function generateRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
