let testContacts = [
    {
        'name': 'Anton Mayer',
        'mail': 'antom@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Hans Mueller',
        'mail': 'hans@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Benedikt Ziegler',
        'mail': 'benedikt@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'David Eisenberg',
        'mail': 'davidberg@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Eva Fischer',
        'mail': 'eva@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Emmanuel Mauer',
        'mail': 'emmanuelma@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Marcel Bauer',
        'mail': 'bauer@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Tatjana Wolf',
        'mail': 'wolf@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Klaus Werner',
        'mail': 'klausw@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    },
    {
        'name': 'Peter Hahn',
        'mail': 'peterhahn@gmail.com',
        'phone': '+491234567890',
        'color': generateRandomColor()
    }
];

let testTasks = [
    {
        'id': 1,
        'items': [
            {
                'id': '7955',
                'category': 'User Story',
                'title': 'Kochwelt Page & Recipe Recommender',
                'description': 'Build start page with recipe recommendation.',
                'assigned': [
                    { 'color': '', 'name': 'Emmanuel', 'lastName': 'Mauer' },
                    { 'color': '', 'name': 'Marcel', 'lastName': 'Bauer' },
                    { 'color': '', 'name': 'Tatjana', 'lastName': 'Wolf' }
                ],
                'date': '10/05/2025',
                'priority': 'medium',
                'subtasks': [
                    { 'checked': false, 'task': 'Implement Recipe Recommendation' },
                    { 'checked': true, 'task': 'Start Page Layout' }
                ]
            },
            {
                'id': '2453',
                'category': 'Technical Task',
                'title': 'HTML Base Template Creation',
                'description': 'Create reusable HTML base templates...',
                'assigned': [
                    { 'color': '', 'name': 'David', 'lastName': 'Eisenberg' },
                    { 'color': '', 'name': 'Benedikt', 'lastName': 'Ziegler' },
                    { 'color': '', 'name': 'Anton', 'lastName': 'Mayer' }
                ],
                'date': '10/05/2025',
                'priority': 'low',
                'subtasks': [
                    { 'checked': false, 'task': 'Implement Recipe Recommendation' },
                    { 'checked': true, 'task': 'Start Page Layout' }
                ]
            },
            {
                'id': '0945',
                'category': 'User Story',
                'title': 'Daily Kochwelt Recipe',
                'description': 'Implement daily recipe and portion calculator...',
                'assigned': [
                    { 'color': '', 'name': 'Emmanuel', 'lastName': 'Mauer' },
                    { 'color': '', 'name': 'Anton', 'lastName': 'Mayer' },
                    { 'color': '', 'name': 'Tatjana', 'lastName': 'Wolf' }
                ],
                'date': '10/05/2025',
                'priority': 'medium',
                'subtasks': [
                    { 'checked': false, 'task': 'Implement Recipe Recommendation' },
                    { 'checked': true, 'task': 'Start Page Layout' }
                ]
            },
        ]
    },
    {
        'id': 2,
        'items': [
            {
                'id': '7489',
                'category': 'Technical Task',
                'title': 'CSS Architecture Planning',
                'description': 'Define CSS naming conventions and structure...',
                'assigned': [
                    { 'color': '', 'name': 'Stefan', 'lastName': 'Meier' },
                    { 'color': '', 'name': 'Benedikt', 'lastName': 'Ziegler' }
                ],
                'date': '10/05/2025',
                'priority': 'urgent',
                'subtasks': [
                    { 'checked': false, 'task': 'Implement Recipe Recommendation' },
                    { 'checked': true, 'task': 'Start Page Layout' }
                ]
            }
        ]
    },
    {
        'id': 3,
        'items': '',
    },
    {
        'id': 4,
        'items': '',
    },

]


/**
 * This function is used to render the page if the user refresh the page or switch from another HTML-page to this one.
 * 
 * @author: Robin
 */

// async function init() {
//     loadUsers();
//     checkAcceptPrivacyPolicy();
// document.getElementById('msgBoxSignedUp').classList.add('d-none');
// document.getElementById('registerContainer').classList.remove('d-none');
// }

/**
 * This function is used to block and reactivate the button, if the user accepts the privacy policy and the inputs are not empty.
 * 
 * @author: Robin
 */
function checkAcceptPrivacyPolicy() {
    let checkbox = document.getElementById('checkbox');
    let buttonId = document.getElementById('signUpButton');
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password1').value;
    let confirmPassword = document.getElementById('password2').value;
    if (checkbox.checked && name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
        buttonId.classList.remove('signUpButtonFalse');
        buttonId.classList.add('signUpButtonTrue');
    } else {
        buttonId.classList.remove('signUpButtonTrue');
        buttonId.classList.add('signUpButtonFalse');
    }
}

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


//Math.floor(Math.random() * 10000);

async function addUser() {
    let msgBox = document.getElementById('msgBox');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password1');
    let confirmPassword = document.getElementById('password2');
    let newArray = [{ 'mail': email.value, 'name': name.value, 'password': password.value, 'contacts': testContacts, 'tasks': testTasks }];
    let actualUsers = await loadData('users');
    let actualisedUsers = [...newArray, ...actualUsers];
    if (actualUsers.length === 0) {
        actualisedUsers = [...newArray];
    };
    for (let mailSearchIndex = 0; mailSearchIndex < actualUsers.length; mailSearchIndex++) {
        if (actualUsers[mailSearchIndex] === null) {
            continue;
        } else {
            let mailToCheck = actualUsers[mailSearchIndex]['mail'];
            if (JSON.stringify(mailToCheck) === JSON.stringify(email.value)) {
                let msgBoxText = document.getElementById('msgBoxText');
                msgBoxText.innerHTML = 'User already exists. Please use another Mail-Adress!';
                msgBox.classList.remove('d-none');
                await setTimeout(function () {
                    msgBox.classList.add('d-none');
                }, 2000);
                return;
            }
        }
    };
    await putNewUser(password, confirmPassword, msgBox, actualisedUsers);
}

async function putNewUser(password, confirmPassword, msgBox, actualisedUsers) {
    if (password.value === confirmPassword.value) {
        await putData('users', actualisedUsers);
        document.getElementById('registerContainer').classList.add('d-none');
        msgBoxSignedUp.classList.remove('d-none');
        setTimeout(function () {
            window.location.href = 'login.html?msg=Registrierung erfolgreich';
        }, 3000);
    } else {
        let msgBoxText = document.getElementById('msgBoxText');
        msgBoxText.innerHTML = `Ups! your password don't match.`;
        msgBox.classList.remove('d-none');
        await setTimeout(function () {
            msgBox.classList.add('d-none');
        }, 2000);
    }
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(user => user.email === email.value && user.password === password.value);
    if (user) {
        window.location.href = 'summary.html';
    } else {
        msgBox.classList.remove('d-none');
        msgBox.innerHTML = 'Login fehlgeschlagen';
    }
}