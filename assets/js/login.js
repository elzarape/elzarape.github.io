const form = document.getElementById("form-login");
const userInput = document.getElementById("username");
const passInput = document.getElementById("password");
const alertValidate = document.getElementById("msg-validate");
const host = window.location.host;
let users;
let aStatus;

function loadData() {
    return Promise.all([
        fetch("https://elzarape.github.io/admin/data/users.json")
            .then((response) => response.json())
            .then((data) => {
                users = data;
            }).catch((error) => console.error('Error al cargar usuarios:', error)),
        fetch("http://127.0.0.1:5500/admin/data/status.json")
            .then((response) => response.json())
            .then((data) => {
                aStatus = data;
            }).catch((error) => console.error('Error al cargar status:', error))
    ]);
}

function login() {
    loadData().then(() => {
        if (form.checkValidity()) {
            const user = users.find((user) => userInput.value === user.user);

            if (user && user.status == 1) {
                const passDecrypted = decryptPassword(user.password);
                if (passDecrypted === passInput.value) {
                    userLogged = user;
                    userInput.value = '';
                    passInput.value = '';
                    user = 
                    window.location.href = `/admin/panel.html`;
                } else {
                    validate(userInput, 'Usuario o contraseña incorrectos');
                }
            } else {
                validate(userInput, 'Usuario o contraseña incorrectos');
            }
        } else {
            validate(userInput, 'Los campos no pueden estar vacíos');
        }
    }).catch((error) => console.error('Error en la carga de datos:', error));
}

function validate(input, message) {
    alertValidate.style.display = 'flex';
    alertValidate.textContent = message;
    userInput.value = '';
    passInput.value = '';
    input.focus();
}

document.getElementById("btn-login").addEventListener("click", login);
userInput.addEventListener("keydown", () => {
    alertValidate.style.display = 'none';
});

passInput.addEventListener("keydown", () => {
    alertValidate.style.display = 'none';
});

function decryptPassword(encrypted) {
    // Decrypted
    const key = 'U2FsdGVkX1+u4K820u8qJFfGJM5lWThM0N849JSrKwE=';
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}
