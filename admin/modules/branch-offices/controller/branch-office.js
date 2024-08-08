const formTitle = document.getElementById("form-title");
const nameInput = document.getElementById("name-branch");
const streetInput = document.getElementById("street-branch");
const numberInput = document.getElementById("number-branch");
const neHoodInput = document.getElementById("neighborhood-branch");
const cpInput = document.getElementById("cp-branch");
const stateInput = document.getElementById("state-branch");
const latitudeInput = document.getElementById("latitude-branch");
const longitudeInput = document.getElementById("longitude-branch");
const urlInput = document.getElementById("url-branch");
const schedulesInput = document.getElementById("schedules-branch");
const imageInput = document.getElementById("image-branch");
const statusInput = document.getElementById("status-branch");
const containerStatus = document.getElementById("container-status");
const paraCurrentImage = document.getElementById("p-current-image");

const btnCreate = document.getElementById("btn-preview-create");
const btnUpdate = document.getElementById("btn-preview-update");
const btnDelete = document.getElementById("btn-preview-delete");
const btnCancel = document.getElementById("btn-cancel");
const btnClean = document.getElementById("btn-clean");


let action;
let branches = []; // Array created JSON data
let states;
let aStatus = []; // Array created status JSON data
let indexBranchSelected;

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
    formTitle.textContent = "Crear nueva Sucursal"
    containerStatus.style.display = 'none';
    statusInput.removeAttribute("required");
    imageInput.setAttribute("required", "");
    btnCreate.style.display = 'block';
    btnDelete.style.display = 'none';
    btnUpdate.style.display = 'none';
    paraCurrentImage.textContent = '';
    $('#modal-form').modal('show');
});

document.getElementById("btn-agree").addEventListener("click", actionForm);


function loadData() {
    return Promise.all([
        fetch("https://elzarape.github.io/admin/data/branch-offices.json")
            .then((response) => response.json())
            .then((data) => {
                branches = data;
            }),
        fetch("https://elzarape.github.io/admin/data/states.json")
            .then((response) => response.json())
            .then((data) => {
                states = data;
            }),
        fetch("https://elzarape.github.io/admin/data/status.json")
            .then((response) => response.json())
            .then((data) => {
                aStatus = data;
            })
    ]);
}


function updateTable() {
    let body = "";

    branches.forEach(function (elemento) {
        let status = aStatus.find(item => item.id == elemento.status)?.status;
        let registro = '<tr>' +
            '<tr class="table-row">' +
            '<td>' + Number(branches.indexOf(elemento) + 1) + '</td>' +
            '<td>' + elemento.name + '</td>' +
            '<td>' + elemento.number + `, ` + elemento.street + `, ` + elemento.neighborhood + `, ` + elemento.cp + `, ` + states[elemento.state] + `, México`  + '</td>' +
            '<td>' + elemento.latitude + ` ` + elemento.longitude + '</td>' +
            '<td>' + elemento.url + '</td>' +
            '<td><img class="table__item-img" src="' + elemento.image + '" width="100"></td>' +
            '<td>' + elemento.schedules + '</td>' +
            '<td>' + (status ? "Activo" : "Inactivo") + '</td>' +
            '</tr>';
        body += registro;
    });
    document.getElementById("table-branch").innerHTML = body;
    let rowsBranch = document.querySelectorAll(".table-row");
    for (let i = 0; i < rowsBranch.length; i++) {
        rowsBranch[i].addEventListener("click", () => {
            containerStatus.style.display = 'block';
            statusInput.setAttribute("required", "");
            imageInput.removeAttribute("required");
            paraCurrentImage.style.display = 'block';
            $('#modal-form').modal('show');
            selectBranch(i)
        });
    }

    
}

async function getFormElements(typeForm) {
    const branch = {
        name: nameInput.value,
        street: streetInput.value,
        number: numberInput.value,
        neighborhood: neHoodInput.value,
        cp: cpInput.value,
        state: stateInput.value,
        latitude: latitudeInput.value,
        longitude: longitudeInput.value,
        imageName: null,
        image: imageInput.value,
        url: urlInput.value,
        schedules: schedulesInput.value,
        status: typeForm == "create" ? 1 : statusInput.value
    };
    let file = imageInput.files[0];
    if (file) {
        try {
            branch.image = await getBase64Image(file);
            branch.imageName = file.name; 
        } catch (error) {
            console.error('Error al obtener la imagen en base64:', error);
        }
    }
    return branch;
}

//This function is called to get the image data
function getBase64Image(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result); 
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

function selectBranch(index) {
    let branch = branches[index];
    nameInput.value = branch.name;
    streetInput.value = branch.street;
    numberInput.value = branch.number;
    neHoodInput.value = branch.neighborhood;
    cpInput.value = branch.cp;
    stateInput.value = branch.state;
    latitudeInput.value = branch.latitude;
    longitudeInput.value = branch.longitude;
    urlInput.value = branch.url;
    schedulesInput.value = branch.schedules;
    statusInput.value = branch.status;
    paraCurrentImage.textContent = `Imagen Actual: ${branch.imageName}`;
    formTitle.textContent = `Actualizar "${branch.name}"`;
    btnDelete.style.display = 'block';
    btnUpdate.style.display = 'block';
    btnCreate.style.display = 'none';
    indexBranchSelected = index;
}

function cleanForm() {
    nameInput.value = "";
    streetInput.value = "";
    numberInput.value = "";
    neHoodInput.value = "";
    cpInput.value = "";
    stateInput.value = "";
    latitudeInput.value = "";
    longitudeInput.value = "";
    imageInput.value = ""
    urlInput.value = "";
    schedulesInput.value = "";
    statusInput.value = "";
}




async function actionForm() {
    switch (action) {
        case "create":

            let newBranch = await getFormElements(action);
            branches.push(newBranch);
            cleanForm();
            updateTable();
            break;

        case "update":
            let updateBranch = await getFormElements(action);
            branches[indexBranchSelected].name = updateBranch.name;
            branches[indexBranchSelected].street = updateBranch.street;
            branches[indexBranchSelected].number = updateBranch.number;
            branches[indexBranchSelected].neighborhood = updateBranch.neighborhood;
            branches[indexBranchSelected].cp = updateBranch.cp;
            branches[indexBranchSelected].state = updateBranch.state;
            branches[indexBranchSelected].latitude = updateBranch.latitude;
            branches[indexBranchSelected].longitude = updateBranch.longitude;
            branches[indexBranchSelected].url= updateBranch.url;
            branches[indexBranchSelected].schedules = updateBranch.schedules;
            branches[indexBranchSelected].status = updateBranch.status;
            branches[indexBranchSelected].imageName = updateBranch.imageName || branches[indexBranchSelected].imageName;
            branches[indexBranchSelected].image = updateBranch.image || branches[indexBranchSelected].image;
            cleanForm()
            updateTable();
            break;

        case "delete":
            let auxElement = [];
            let elementSelected = branches[indexBranchSelected];
            branches.forEach(function (element) {
                if (element != elementSelected) {
                    auxElement.push(element);
                }
            });
            branches = auxElement;
            cleanForm();
            updateTable();
            break;
    }
}

async function previewInputs() {
    var form = document.getElementById("form-branch");
    if (form.checkValidity()) {
        createPreviewContent(await getFormElements(action));
        $('#modal-form').modal('hide');
        $('#modal-preview').modal('show');
    }
    else {
        form.reportValidity();
    }
}

function previewDelete() {
    createPreviewContent(branches[indexBranchSelected]);
    $('#modal-form').modal('hide');
    $('#modal-preview').modal('show');
}

function createPreviewContent(branch) {
    const containerPreviewL = document.getElementById("img-preview");
    const containerPreviewR = document.getElementById("data-preview");
    let status = aStatus.find(item => item.id == branch.status)?.status;
    
    containerPreviewL.innerHTML = `<img class="image-preview" src="${branch.image == '' ? branches[indexBranchSelected].image : branch.image}" width="200"/>`;
    containerPreviewR.innerHTML =
        `<h3 class="preview_item">${branch.name}</h3>
            <p class="preview__item">Dirección: ${branch.number}, ${branch.neighborhood}, ${branch.cp}, ${states[branch.state]}, México</p>
            <p class="preview__item">Categoría:GPS: ${branch.latitude}, ${branch.longitude}</p>
            <p class="preview__item">URL: ${branch.url}</p>
            <p class="preview__item">Horarios: ${branch.schedules}</p>
            <p class="preview__item">Status: ${status ? "Activo" : "Inactivo"}</p>`;

}

function loadSelectsInpunt() {
    let body = '';
    body = '<option value="">Seleccione una opción...</option>';
    for (const value in states) {
        body += `<option value="${value}">${states[value]}</option>`;
    }
    stateInput.innerHTML = body;

    body = '<option value="">Seleccione una opción...</option>';
    aStatus.forEach(status => {
        body += `<option value="${status.id}">${status.status ? "Activo" : "Inactivo"}</option>`;
    });
    statusInput.innerHTML = body
}

// Cargar los datos y luego actualizar la tabla
loadData().then(() => {
    loadSelectsInpunt()
    updateTable();
});
