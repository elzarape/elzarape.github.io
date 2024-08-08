//Get button elements
const btnCreate = document.getElementById("btn-create");
const btnUpdate = document.getElementById("btn-update");
const btnDelete = document.getElementById("btn-delete");
const cleanCreateForm = document.getElementById("btn-clean-create");
const cleanUpdateForm = document.getElementById("btn-clean-update");

//Button listeners
btnCreate.addEventListener("click", createDrink);
btnUpdate.addEventListener("click", updateDrink);
btnDelete.addEventListener("click", deleteDrink);
cleanCreateForm.addEventListener("click", cleanFormCreate);
cleanUpdateForm.addEventListener("click", cleanFormUpdate);

let drinks = []; // Array created with drink JSON data
let objCategories = {}; // Array created with categories JSON data
let aStatus = []; // Array created with status JSON data
let indexDrinkSelected;

function loadData() {
    return Promise.all([
        fetch("https://elzarape.github.io/admin/data/drinks.json")
            .then((response) => response.json())
            .then((data) => {
                drinks = data;
                console.log("Bebidas cargadas:", drinks);
            }),
        fetch("https://elzarape.github.io/admin/data/categories.json")
            .then((response) => response.json())
            .then((data) => {
                objCategories = data;
                console.log("Categorías cargadas:", objCategories);
            }),
        fetch("https://elzarape.github.io/admin/data/status.json")
            .then((response) => response.json())
            .then((data) => {
                aStatus = data;
                console.log("Estatus cargados:", aStatus);
            })
    ]);
}

function updateTable() {
    let cuerpo = "";
    let category;
    let status;

    drinks.forEach(function (elemento) {
        for (let i = 0; i < objCategories["bebidas"].length; i++) {
            if (objCategories["bebidas"][i].id == elemento.category) {
                category = objCategories["bebidas"][i].category;
                break;
            }
        }

        for (let i = 0; i < aStatus.length; i++) {
            if (aStatus[i].id == elemento.status) {
                status = aStatus[i].status;
                break;
            }
        }

        let registro = '<tr>' +
            '<tr class="table-row" data-bs-target="#modal-update" data-bs-toggle="modal">' +
            '<td>' + Number(drinks.indexOf(elemento) + 1) + '</td>' +
            '<td>' + elemento.name + '</td>' +
            '<td>' + elemento.description + '</td>' +
            '<td>' + category + '</td>' +
            '<td>$' + elemento.price + ' MXN</td>' +
            '<td><img class="table__item-img" src="' + elemento.image + '" width="100"></td>' +
            '<td>' + (status ? "Activo" : "Inactivo") + '</td>' +
            '</tr>';
        cuerpo += registro;
    });
    document.getElementById("table-bebida").innerHTML = cuerpo;
    let rowsDrink = document.querySelectorAll(".table-row");
    for (let i = 0; i < rowsDrink.length; i++) {
        rowsDrink[i].onclick = () => selectDrink(i);
    }
}


async function getCreateFormElements() {
    let name = document.getElementById("name-drink").value;
    let description = document.getElementById("description-drink").value;
    let category = document.getElementById("category-drink").value;
    let price = document.getElementById("price-drink").value;
    let imageDrinkCreate = document.getElementById("image-drink");
    
    let file = imageDrinkCreate.files[0];
    let image = null;
    let imageName = null;

    if (file) {
        try {
            image = await getBase64Image(file);
            imageName = file.name; // Obtener el nombre del archivo
        } catch (error) {
            console.error('Error al obtener la imagen en base64:', error);
        }
    }

    if (name && description && category && price && image) {
        let newDrink = {
            name,
            description,
            price,
            category,
            image,
            imageName, 
            status: 1
        };
        return newDrink;
    } else {
        return null;
    }
}

async function getUpdateFormElements() {
    let name = document.getElementById("name-drink-update").value;
    let description = document.getElementById("description-drink-update").value;
    let category = document.getElementById("category-drink-update").value;
    let price = document.getElementById("price-drink-update").value;
    let status = document.getElementById("status-drink-update").value;
    let imageDrinkUpdate = document.getElementById("image-drink-update");
    let file = imageDrinkUpdate.files[0];
    let image = null;
    let imageName = null;

    if (file) {
        try {
            image = await getBase64Image(file);
            imageName = file.name; // Obtener el nombre del archivo
            console.log(imageName);
        } catch (error) {
            console.error('Error al obtener la imagen en base64:', error);
        }
    }

    if (name && description && category && price && status) {
        let updateDrink = {
            name,
            description,
            price,
            category,
            image,
            imageName, // Guardar el nombre del archivo
            status
        };
        return updateDrink;
    } else {
        return null;
    }
}




function selectDrink(index) {
    let bebida = drinks[index];
    document.getElementById("name-drink-update").value = bebida.name;
    document.getElementById("description-drink-update").value = bebida.description;
    document.getElementById("category-drink-update").value = bebida.category;
    document.getElementById("price-drink-update").value = bebida.price;
    document.getElementById("status-drink-update").value = bebida.status;
    indexDrinkSelected = index;
    let pCuurentImg = document.getElementById("p-current-image");
    pCuurentImg.textContent = `Imagen Actual: ${bebida.imageName}`;
}


function cleanFormCreate() {
    document.getElementById("name-drink").value = "";
    document.getElementById("description-drink").value = "";
    document.getElementById("category-drink").value = "0";
    document.getElementById("price-drink").value = "";
    document.getElementById("image-drink").value = "";
}

function cleanFormUpdate() {
    document.getElementById("name-drink-update").value = "";
    document.getElementById("description-drink-update").value = "";
    document.getElementById("category-drink-update").value = "0";
    document.getElementById("price-drink-update").value = "";
    document.getElementById("image-drink-update").value = "";
    document.getElementById("status-drink-update").value = "0";
}


document.getElementById("btn-preview-create").addEventListener("click", previewCreate);

async function previewCreate() {
    var form = document.getElementById("form-create-drink");
    if (form.checkValidity()) {
        let category;
        let status;
        const containerPreviewL = document.getElementById("img-preview-create");
        const containerPreviewR = document.getElementById("data-preview-create");
        let newDrink = await getCreateFormElements();
        console.log(newDrink)
        if (newDrink) {
            for (let i = 0; i < objCategories["bebidas"].length; i++) {
                if (objCategories["bebidas"][i].id == newDrink.category) {
                    category = objCategories["bebidas"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == newDrink.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }
        containerPreviewL.innerHTML = `<img class="image-preview" src="${newDrink.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${newDrink.name}</h3>
        <p class="preview-desciption">${newDrink.description}</p>
        <p class="preview-category">Categoría: ${category}</p>
        <p class="preview-status">Estatus: ${status ? "Activo" : "Inactivo"}</p>
        <p class="preview-price">Precio: $${newDrink.price}MXN</p>`;
        $('#modal-create').modal('hide');
        $('#modal-preview').modal('show');

    }
    else {
        form.reportValidity();
    }
}

document.getElementById("btn-preview-delete").addEventListener("click", previewDelete);
function previewDelete() {
        let category;
        let status
        const containerPreviewL = document.getElementById("img-preview-delete");
        const containerPreviewR = document.getElementById("data-preview-delete");
        let deleteDrink = drinks[indexDrinkSelected];
        if (deleteDrink) {
            for (let i = 0; i < objCategories["bebidas"].length; i++) {
                if (objCategories["bebidas"][i].id == deleteDrink.category) {
                    category = objCategories["bebidas"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == deleteDrink.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }
        containerPreviewL.innerHTML = `<img class="image-preview" src="${deleteDrink.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${deleteDrink.name}</h3>
        <p class="preview-desciption">${deleteDrink.description}</p>
        <p class="preview-category">Categoría: ${category}</p>
        <p class="preview-status">Estatus: ${status ? "Activo" : "Inactivo"}</p>
        <p class="preview-price">Precio: $${deleteDrink.price}MXN</p>`;
        $('#modal-update').modal('hide');
        $('#modal-preview-delete').modal('show');
}


document.getElementById("btn-preview-update").addEventListener("click", previewUpdate);

async function previewUpdate() {
    var form = document.getElementById("form-update-drink");
    if (form.checkValidity()) {
        let category;
        let status;
        const containerPreviewL = document.getElementById("img-preview-update");
        const containerPreviewR = document.getElementById("data-preview-update");
        let updateDrink = await getUpdateFormElements();
        if (updateDrink) {
            for (let i = 0; i < objCategories["bebidas"].length; i++) {
                if (objCategories["bebidas"][i].id == updateDrink.category) {
                    category = objCategories["bebidas"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == updateDrink.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }

        console.log(updateDrink.image)
        containerPreviewL.innerHTML = `<img class="image-preview" src="${updateDrink.image == null ? drinks[indexDrinkSelected].image : updateDrink.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${updateDrink.name}</h3>
            <p class="preview-desciption">${updateDrink.description}</p>
            <p class="preview-category">Categoría: ${category}</p>
            <p class="preview-price">Precio: $${updateDrink.price}MXN</p>
            <p class="preview-status">Status: ${status ? "Activo" : "Inactivo"}</p>`;
        $('#modal-update').modal('hide');
        $('#modal-preview-update').modal('show');
    }
    else {
        form.reportValidity();
    }


}

async function createDrink() {
    let newDrink = await getCreateFormElements();
    drinks.push(newDrink);
    console.log(drinks)
    cleanFormCreate();
    updateTable();
}

function getBase64Image(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Evento cuando la lectura se completa
        reader.onload = function (e) {
            resolve(e.target.result); // Retorna la cadena base64
        };

        // Evento en caso de error
        reader.onerror = function (error) {
            reject(error);
        };

        // Leer el archivo como una URL de datos (data URL)
        reader.readAsDataURL(file);
    });
}

async function updateDrink() {
    let updateDrink = await getUpdateFormElements();
    drinks[indexDrinkSelected].name = updateDrink.name;
    drinks[indexDrinkSelected].description = updateDrink.description;
    drinks[indexDrinkSelected].price = updateDrink.price;
    drinks[indexDrinkSelected].category = updateDrink.category;
    drinks[indexDrinkSelected].status = updateDrink.status;
    drinks[indexDrinkSelected].imageName = updateDrink.imageName || drinks[indexDrinkSelected].imageName;
    drinks[indexDrinkSelected].image = updateDrink.image || drinks[indexDrinkSelected].image;
    cleanFormUpdate()
    updateTable();
    console.log(drinks[indexDrinkSelected]);
}


function deleteDrink() {
    let nuevoArreglo = [];
    let elementoSeleccionado = drinks[indexDrinkSelected];
    drinks.forEach(function (elemento) {
        if (elemento != elementoSeleccionado) {
            nuevoArreglo.push(elemento);
        }
    });
    drinks = nuevoArreglo;
    updateTable();
}

function exportSelects() {
    const selectCategories = document.querySelectorAll(".select-categories");
    const selectStatus = document.getElementById("status-drink-update");

    selectCategories.forEach(element => {
        let body = '';
        for (let i = 0; i < objCategories["bebidas"].length; i++) {
            if (i == 0 && element.getAttribute("id") == "category-drink") {
                body += `<option value="">Selecciona una opcion...</option>`;
            } else {
                body += `<option value="${objCategories["bebidas"][i].id}">${objCategories["bebidas"][i].category}</option>`;
            }
        }
        element.innerHTML = body;
    });

    let body = '';
    aStatus.forEach(status => {
        body += `<option value="${status.id}">${status.status ? "Activo" : "Inactivo"}</option>`;
    });
    selectStatus.innerHTML = body;
}

// Cargar los datos y luego actualizar la tabla
loadData().then(() => {
    exportSelects()
    updateTable();
});