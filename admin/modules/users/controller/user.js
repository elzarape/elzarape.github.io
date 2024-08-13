const formTitle = document.getElementById("form-title");
const nameInput = document.getElementById("name-user");
const fLastNameInput = document.getElementById("f-last-name-user");
const mLastNameInput = document.getElementById("m-last-name-user");
const phoneInput = document.getElementById("phone-user");
const branchInput = document.getElementById("branch-user");
const userInput = document.getElementById("username-user");
const passInput = document.getElementById("password-user");
const cPassInput = document.getElementById("confirm-password-user");
const statusInput = document.getElementById("status-user");
const containerStatus = document.getElementById("container-status");
const divRequirements = document.querySelectorAll(".requirement");
const btnUpdatePass = document.getElementById("btn-update-password");
const sectionPass = document.querySelector(".container-section-pass");
const btnCreate = document.getElementById("btn-preview-create");
const btnUpdate = document.getElementById("btn-preview-update");
const btnDelete = document.getElementById("btn-preview-delete");
const btnCancel = document.getElementById("btn-cancel");
const btnClean = document.getElementById("btn-clean");


let action;
let users = []; // Array created JSON data
let branches = [];
let aStatus = []; // Array created status JSON data
let indexUserSelected;

btnCreate.addEventListener("click", () => {
    action = "create";
    previewInputs();
});


btnUpdate.addEventListener("click", () => {
    action = "update";
    previewInputs();

});

btnDelete.addEventListener("click", () => {
    action = "delete";
    previewDelete();

});

btnCancel.addEventListener("click", cleanForm);
btnClean.addEventListener("click", cleanForm);

document.getElementById("btn-create").addEventListener("click", () => {
    cleanForm();
    formTitle.textContent = "Crear nuevo usuario"
    containerStatus.style.display = 'none';
    btnUpdatePass.style.display = "none";
    sectionPass.style.display = "inline";
    passInput.setAttribute("required", "");
    cPassInput.setAttribute("required", "")
    statusInput.removeAttribute("required");
    btnCreate.style.display = 'block';
    btnDelete.style.display = 'none';
    btnUpdate.style.display = 'none';
    $('#modal-form').modal('show');
});

document.getElementById("btn-agree").addEventListener("click", actionForm);


function loadData() {
    return Promise.all([
        fetch("https://elzarape.github.io/admin/data/users.json")
            .then((response) => response.json())
            .then((data) => {
                users = data;
            }),
        fetch("https://elzarape.github.io/admin/data/branch-offices.json")
            .then((response) => response.json())
            .then((data) => {
                branches = data;
            }),
        fetch("https://elzarape.github.io/admin/data/status.json")
            .then((response) => response.json())
            .then((data) => {
                aStatus = data;
            })
    ]);
}


function updateTable(listUsers = users) {
    let body = "";
    console.log(listUsers)
    listUsers.forEach(function (elemento) {
        let status = aStatus.find(item => item.id == elemento.status)?.status;
        let branch = branches.find(item => Number(branches.indexOf(item) + 1) == elemento.branch)?.name;
        let registro = '<tr>' +
            '<tr class="table-row">' +
            '<td>' + Number(listUsers.indexOf(elemento) + 1) + '</td>' +
            '<td>' + elemento.name + '</td>' +
            '<td>' + elemento.fLastName + ' ' + elemento.mLastName + '</td>' +
            '<td>' + elemento.phone + '</td>' +
            '<td>' + branch + '</td>' +
            '<td>' + elemento.user + '</td>' +
            '<td>' + (status ? "Activo" : "Inactivo") + '</td>' +
            '</tr>';
        body += registro;
    });
    document.getElementById("table-user").innerHTML = body;
    let rowsUser = document.querySelectorAll(".table-row");
    for (let i = 0; i < rowsUser.length; i++) {
        rowsUser[i].addEventListener("click", () => {
            containerStatus.style.display = 'block';
            statusInput.setAttribute("required", "");
            $('#modal-form').modal('show');
            selectUser(i)
        });
    }
}

function getFormElements(typeForm) {
    const user = {
        name: nameInput.value,
        fLastName: fLastNameInput.value,
        mLastName: mLastNameInput.value,
        phone: phoneInput.value,
        branch: branchInput.value,
        user: userInput.value,
        password: passInput.value,
        status: typeForm == "create" ? 1 : statusInput.value
    };
    return user;
}


function selectUser(index) {
    let user = users[index];
    nameInput.value = user.name;
    fLastNameInput.value = user.fLastName;
    mLastNameInput.value = user.mLastName;
    phoneInput.value = user.phone;
    branchInput.value = user.branch;
    userInput.value = user.user;
    statusInput.value = user.status;
    formTitle.textContent = `Actualizar usuario`;
    btnDelete.style.display = 'block';
    btnUpdate.style.display = 'block';
    btnCreate.style.display = 'none';
    btnUpdatePass.style.display = "inline";
    sectionPass.style.display = "none";
    passInput.removeAttribute("required");
    cPassInput.removeAttribute("required");
    btnUpdatePass.classList.remove("active");
    btnUpdatePass.classList.remove("btn-not-active");
    btnUpdatePass.classList.add("btn-action");
    indexUserSelected = index;
}

function cleanForm() {
    nameInput.value = '';
    fLastNameInput.value = '';
    mLastNameInput.value = '';
    phoneInput.value = '';
    branchInput.value = '';
    userInput.value = '';
    passInput.value = '';
    cPassInput.value = '';
    statusInput.value = '';
    togglePassword.style.display = "none";
    cPassInput.removeAttribute("disabled")
    divRequirements.forEach(element => {
        element.innerHTML = '';
    });

}




function actionForm() {
    switch (action) {
        case "create":
            let newUser = getFormElements(action);
            newUser.password = encryptPassword(newUser.password);
            console.log(newUser)
            users.push(newUser);
            console.log(newUser, users);
            cleanForm();
            updateTable();
            break;

        case "update":
            let updateUser = getFormElements(action);
            for (let key in updateUser) {
                if (updateUser[key] === "") {
                    continue;
                }
                if (key == 'password') {
                    users[indexUserSelected][key] = encryptPassword(updateUser[key]);
                } else {
                    users[indexUserSelected][key] = updateUser[key];
                }
                console.log(users)
            }
            cleanForm()
            updateTable();
            break;

        case "delete":
            let auxElement = [];
            let elementSelected = users[indexUserSelected];
            users.forEach(function (element) {
                if (element != elementSelected) {
                    auxElement.push(element);
                }
            });
            users = auxElement;
            cleanForm();
            updateTable();
            break;
    }
}


function verifyPass() {
    const password = passInput.value;
    const divLowerCase = document.getElementById("r-lower-case");
    const divUpperCase = document.getElementById("r-upper-case");
    const divDigit = document.getElementById("r-digit");
    const divSpecialChar = document.getElementById("r-special-char");
    const divLength = document.getElementById("r-length");

    const checkIcon = '<i class="requirement__icon fa-solid fa-check" id="requirement-check"></i>';
    const xMarkIcon = '<i class="requirement__icon fa-solid fa-xmark" id="requirement-xmark"></i>';

    if (password != '') {
        togglePassword.style.display = "inline"
        const requirements = [
            { test: /[a-z]/, element: divLowerCase, text: 'Contiene al menos una letra minúscula' },
            { test: /[A-Z]/, element: divUpperCase, text: 'Contiene al menos una letra mayúscula' },
            { test: /\d/, element: divDigit, text: 'Contiene al menos un dígito' },
            { test: /[@$!%*?&]/, element: divSpecialChar, text: 'Contiene al menos un carácter especial' },
            { test: /.{12,}/, element: divLength, text: 'Contiene al menos 12 caracteres' }
        ];

        let isValid = true;

        requirements.forEach(requirement => {
            if (requirement.test.test(password)) {
                requirement.element.innerHTML = `${checkIcon} <p class="requirement__text">${requirement.text}</p>`;
            } else {
                requirement.element.innerHTML = `${xMarkIcon} <p class="requirement__text">${requirement.text}</p>`;
                isValid = false;
            }
        });
        return isValid;
    } else {
        togglePassword.style.display = "none";
        cPassInput.value = ""
        divRequirements.forEach(element => {
            element.innerHTML = '';
        });
    }
}

function generatePassword() {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '@$!%*?&';

    let password = '';
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
    while (password.length < 12) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}


function encryptPassword(password) {
    const key = 'U2FsdGVkX1+u4K820u8qJFfGJM5lWThM0N849JSrKwE=';
    const encrypted = CryptoJS.AES.encrypt(password, key).toString();
    return encrypted;
}


passInput.addEventListener("keyup", () => {
    confirm = verifyPass();
    cPassInput.removeAttribute("disabled")
});

passInput.addEventListener("focus", () => {
    passInput.value !== '' ? togglePassword.style.display = "inline" : togglePassword.style.display = "none";
});


btnUpdatePass.addEventListener("click", function () {
    this.classList.toggle("btn-not-active");
    this.classList.toggle("btn-action");
    if (this.classList.toggle("active")) {
        sectionPass.style.display = "inline";
        togglePassword.style.display = 'none';
        passInput.setAttribute("required", "");
        cPassInput.setAttribute("required", "");
        cPassInput.setAttribute("required", "");
        cPassInput.removeAttribute("disabled");
        this.textContent = "No cambiar contraseña";
    } else {
        sectionPass.style.display = "none";
        passInput.removeAttribute("required");
        cPassInput.removeAttribute("required");
        passInput.value = '';
        cPassInput.value = '';
        divRequirements.forEach(element => {
            element.innerHTML = '';
        });
        this.textContent = "Modificar contraseña";
    }

});


cPassInput.addEventListener("focus", () => {
    passInput.setAttribute('type', 'password');
    togglePassword.querySelector('.password-eye').classList.toggle('fa-eye');
    togglePassword.querySelector('.password-eye').classList.toggle('fa-eye-slash');
    togglePassword.style.display = "none";
});

document.getElementById("btn-generate-password").addEventListener("click", () => {
    passInput.value = generatePassword();
    cPassInput.value = passInput.value;
    cPassInput.setAttribute("disabled", "")
    confirm = verifyPass();
});

const togglePassword = document.querySelector(".toggle-password");
togglePassword.addEventListener('click', function () {
    // Alternar el tipo de input entre 'password' y 'text'
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);

    // Alternar el icono del ojo
    this.querySelector('.password-eye').classList.toggle('fa-eye');
    this.querySelector('.password-eye').classList.toggle('fa-eye-slash');
});


function previewInputs() {
    const form = document.getElementById("form-user");
    if (form.checkValidity()) {
        if (confirm) {
            if (passInput.value === cPassInput.value) {
                createPreviewContent(getFormElements(action));
                document.getElementById("confirm-password").textContent = ""
                $('#modal-form').modal('hide');
                $('#modal-preview').modal('show');
            } else {
                cPassInput.focus();
                document.getElementById("confirm-password").textContent = "Los contraseña no coincide"
            }
        } else {
            passInput.focus();
        }
    }
    else {
        form.reportValidity();
    }
}

function previewDelete() {
    createPreviewContent(users[indexUserSelected]);
    $('#modal-form').modal('hide');
    $('#modal-preview').modal('show');
}

function createPreviewContent(user) {
    const containerPreviewR = document.getElementById("data-preview");
    let status = aStatus.find(item => item.id == user.status)?.status;
    let branch = branches.find(item => Number(branches.indexOf(item) + 1) == user.branch)?.name;
    containerPreviewR.innerHTML =
        `<h3 class="preview_item">${user.name} ${user.fLastName} ${user.mLastName}</h3>
            <p class="preview__item"><b>Número telefónico:</b><br> ${user.phone}</p>
            <p class="preview__item"><b>Sucursal:</b><br> ${branch}</p>
            <p class="preview__item"><b>Usuario:</b><br> ${user.user}</p>
            <p class="preview__item"><b>Status:</b><br> ${status ? "Activo" : "Inactivo"}</p>`;
}

function loadSelectsInpunt() {
    let body = '';
    body = '<option value="">Seleccione una opción...</option>';
    branches.forEach(branch => {
        body += `<option value="${Number(branches.indexOf(branch) + 1)}">${branch.name}</option>`;
    });
    branchInput.innerHTML = body;

    body = '<option value="">Seleccione una opción...</option>';
    aStatus.forEach(status => {
        body += `<option value="${status.id}">${status.status ? "Activo" : "Inactivo"}</option>`;
    });
    statusInput.innerHTML = body
}

function toggleSearchFields() {
    let searchFields = document.getElementById('search-fields');
    if (searchFields.style.display === 'none' || searchFields.style.display === '') {
        searchFields.style.display = 'block';
    } else {
        searchFields.style.display = 'none';
    }
}
function searchUser() {
    let nameUser = document.getElementById('search-user').value.toLowerCase();
    let filteredUser = users.filter(user => {
        let nameMatch = user.name.toLowerCase().includes(nameUser);
        return nameMatch;
    });
    loadBranch(filteredUser);
}

function loadBranch(filteredUser) {
    updateTable(filteredUser)
}

// Cargar los datos y luego actualizar la tabla
loadData().then(() => {
    loadSelectsInpunt()
    updateTable(users);
});
