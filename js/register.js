let users = [
    {'email': 'admin@test.de', 'password': 'admin'},
];


async function init(){
    loadUsers();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


async function register() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
}

function addUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({email: email.value, password: password.value});
    //Weiterleitung zu Login Seite & Nachricht anzeigen: "Registrierung erfolgreich"
    window.location.href = 'login.html?msg=Registrierung erfolgreich';
}

const UrlParams = new URLSearchParams(window.location.search);
const msg = UrlParams.get('msg');
if(msg) {
    msgBox.classList.remove('d-none');
    msgBox.innerHTML = msg;
} else {
    msgBox.classList.add('d-none');
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