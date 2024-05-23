let testContacts = [
  {
    name: "Anton Mayer",
    mail: "antom@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Hans Mueller",
    mail: "hans@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Benedikt Ziegler",
    mail: "benedikt@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "David Eisenberg",
    mail: "davidberg@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Eva Fischer",
    mail: "eva@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Emmanuel Mauer",
    mail: "emmanuelma@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Marcel Bauer",
    mail: "bauer@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Tatjana Wolf",
    mail: "wolf@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Klaus Werner",
    mail: "klausw@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Peter Hahn",
    mail: "peterhahn@gmail.com",
    phone: "+491234567890",
    color: generateRandomColor(),
    assigned: false,
  },
  {
    name: "Stefan Meier",
    mail: "stefanMeier@gmail.com",
    phone: "+491213212390",
    color: generateRandomColor(),
  },
];

let testTasks = [
  {
    id: 1,
    items: [
      {
        id: 7955,
        category: "User Story",
        title: "Kochwelt Page & Recipe Recommender",
        description: "Build start page with recipe recommendation.",
        assigned: [
          { color: "", name: "Emmanuel Mauer" },
          { color: "", name: "Marcel Bauer" },
          { color: "", name: "Tatjana Wolf" },
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
        category: "Technical Task",
        title: "HTML Base Template Creation",
        description: "Create reusable HTML base templates...",
        assigned: [
          { color: "", name: "David Eisenberg" },
          { color: "", name: "Benedikt Ziegler" },
          { color: "", name: "Anton Mayer" },
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
        category: "User Story",
        title: "Daily Kochwelt Recipe",
        description: "Implement daily recipe and portion calculator...",
        assigned: [
          { color: "", name: "Emmanuel Mauer" },
          { color: "", name: "Anton Mayer" },
          { color: "", name: "Tatjana Wolf" },
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
        category: "Technical Task",
        title: "CSS Architecture Planning",
        description: "Define CSS naming conventions and structure...",
        assigned: [
          { color: "", name: "Stefan Meier" },
          { color: "", name: "Benedikt Ziegler" },
        ],
        date: "10/05/2025",
        priority: "urgent",
        subtasks: [
          { checked: false, task: "Implement Recipe Recommendation" },
          { checked: true, task: "Start Page Layout" },
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
