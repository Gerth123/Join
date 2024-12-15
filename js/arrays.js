/**
 * This variable contains the data for the contacts that automatically appear in the contacts HTML.
 * 
 * @author Robin
 */
let testContacts = [
  {
    name: "Anton Mayer",
    email: "antom@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Hans Mueller",
    email: "hans@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Benedikt Ziegler",
    email: "benedikt@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "David Eisenberg",
    email: "davidberg@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Eva Fischer",
    email: "eva@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Emmanuel Mauer",
    email: "emmanuelma@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Marcel Bauer",
    email: "bauer@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Tatjana Wolf",
    email: "wolf@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Klaus Werner",
    email: "klausw@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Peter Hahn",
    email: "peterhahn@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
  },
  {
    name: "Stefan Meier",
    email: "stefanMeier@gmail.com",
    phone: "+491213212390",
    color: generateRandomColor(),
  },
];

/**
 * This variable contains the data for the tasks that automatically appear in the tasks HTML.
 * 
 * @author Robin
 */
let testTasks = [
  {
    id: 1,
    items: [
      {
        id: 7955,
        category: "user story",
        title: "Kochwelt Page & Recipe Recommender",
        description: "Build start page with recipe recommendation.",
        assigned: [
          { color: generateRandomColor(), name: "Emmanuel Mauer" },
          { color: generateRandomColor(), name: "Marcel Bauer" },
          { color: generateRandomColor(), name: "Tatjana Wolf" },
        ],
        date: "10/05/2025",
        priority: "medium",
        subtasks: [
          { checked: false, task: "Implement Recipe Recommendation" },
          { checked: true, task: "Start Page Layout" },
        ],
      },
      {
        id: 2453,
        category: "technical task",
        title: "HTML Base Template Creation",
        description: "Create reusable HTML base templates...",
        assigned: [
          { color: generateRandomColor(), name: "David Eisenberg" },
          { color: generateRandomColor(), name: "Benedikt Ziegler" },
          { color: generateRandomColor(), name: "Anton Mayer" },
        ],
        date: "10/05/2025",
        priority: "low",
        subtasks: [
          { checked: false, task: "Implement Recipe Recommendation" },
          { checked: true, task: "Start Page Layout" },
        ],
      },
      {
        id: 8945,
        category: "user story",
        title: "Daily Kochwelt Recipe",
        description: "Implement daily recipe and portion calculator...",
        assigned: [
          { color: generateRandomColor(), name: "Emmanuel Mauer" },
          { color: generateRandomColor(), name: "Anton Mayer" },
          { color: generateRandomColor(), name: "Tatjana Wolf" },
        ],
        date: "10/05/2025",
        priority: "medium",
        subtasks: [
          { checked: false, task: "Implement Recipe Recommendation" },
          { checked: true, task: "Start Page Layout" },
        ],
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        id: 7489,
        category: "technical task",
        title: "CSS Architecture Planning",
        description: "Define CSS naming conventions and structure...",
        assigned: [
          { color: generateRandomColor(), name: "Stefan Meier" },
          { color: generateRandomColor(), name: "Benedikt Ziegler" },
        ],
        date: "10/05/2025",
        priority: "urgent",
        subtasks: [
          { checked: false, task: "Implement Recipe Recommendation" },
          { checked: true, task: "Start Page Layout" },
        ],
      },
      {
        id: 9876,
        category: "technical task",
        title: "Fix Responsive Layout Issues",
        description: "Resolve layout issues on mobile devices.",
        assigned: [
          { color: generateRandomColor(), name: "Stefan Meier" },
          { color: generateRandomColor(), name: "David Eisenberg" },
        ],
        date: "10/06/2025",
        priority: "urgent",
        subtasks: [
          { checked: false, task: "Identify Issues" },
          { checked: false, task: "Fix CSS Bugs" },
          { checked: false, task: "Test on Devices" },
        ],
      },
    ],
  },
  {
    id: 3,
    items: "",
  },
  {
    id: 4,
    items: "",
  },
];

/**
 * This function generates a random color and returns it.
 *
 * @author: Robin
 */
function generateRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
