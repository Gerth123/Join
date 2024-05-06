let testContacts = [
    {
        'name': 'Anton Mayer',
        'mail': 'antom@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Hans Mueller',
        'mail': 'hans@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Benedikt Ziegler',
        'mail': 'benedikt@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'David Eisenberg',
        'mail': 'davidberg@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Eva Fischer',
        'mail': 'eva@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Emmanuel Mauer',
        'mail': 'emmanuelma@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Marcel Bauer',
        'mail': 'bauer@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Tatjana Wolf',
        'mail': 'wolf@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Klaus Werner',
        'mail': 'klausw@gmail.com',
        'phone': '+491234567890'
    },
    {
        'name': 'Peter Hahn',
        'mail': 'peterhahn@gmail.com',
        'phone': '+491234567890'
    }]

let testTasks = [
    {
        'type': 'User Story',
        'task': 'Kochwelt Page & Recipe Recommender',
        'description': 'Build start page with recipe recommendation.',
        'Due Date': '10/05/2025',
        'priority': 'Medium',
        'assignedTo': ['Emmanuel Mauer', 'Marcel Bauer', 'Anton Mayer'],
        'Subtasks': ['Implement Recipe Recommendation', 'Start Page Layout']
    },
    {
        'type': 'Technical Task',
        'task': 'HTML Base Template Creation',
        'description': 'Create reusable HTML base templates...',
        'Due Date': '10/05/2025',
        'priority': 'Low',
        'assignedTo': ['David Eisenberg', 'Benedikt Ziegler', 'Anton Mayer'],
        'Subtasks': ['Implement Recipe Recommendation', 'Start Page Layout']
    },
    {
        'type': 'User Story',
        'task': 'Daily Kochwelt Recipe',
        'description': 'Implement daily recipe and portion calculator...',
        'Due Date': '10/05/2025',
        'priority': 'Medium',
        'assignedTo': ['Emmanuel Mauer', 'Anton Mayer', 'Tatjana Wolf'],
        'Subtasks': ['Implement Recipe Recommendation', 'Start Page Layout']
    },
    {
        'type': 'Technical Task',
        'task': 'CSS Architecture Planning',
        'description': 'Define CSS naming conventions and structure...',
        'Due Date': '10/05/2025',
        'priority': 'High',
        'assignedTo': ['Stefan Meier', 'Benedikt Ziegler'],
        'Subtasks': ['Implement Recipe Recommendation', 'Start Page Layout']
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


async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function postData(path = '', data = {}) {
    let response = await fetch(baseUrl + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}


async function addUser() {
    // debugger;
    let msgBox = document.getElementById('msgBox');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password1');
    let confirmPassword = document.getElementById('password2');
    let newArray = [{ 'mail': email.value, 'name': name.value, 'password': password.value, 'contacts': testContacts, 'tasks': testTasks }];
    let actualUsers = await loadData('users');
    let actualisedUsers = [...newArray, ...actualUsers];

    if (actualUsers.value === '') {
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