//Get button elements
const btnCreate = document.getElementById("btn-create");
const btnUpdate = document.getElementById("btn-update");
const btnDelete = document.getElementById("btn-delete");
const cleanCreateForm = document.getElementById("btn-clean-create");
const cleanUpdateForm = document.getElementById("btn-clean-update");

//Button listeners
btnCreate.addEventListener("click", createFood);
btnUpdate.addEventListener("click", updateFood);
btnDelete.addEventListener("click", deleteFood);
cleanCreateForm.addEventListener("click", cleanFormCreate);
cleanUpdateForm.addEventListener("click", cleanFormUpdate);

let foods = []; // Array created with food JSON data
let objCategories = {}; // Array created with categories JSON data
let aStatus = []; // Array created with status JSON data
let indexFoodSelected;

function loadData() {
    return Promise.all([
        fetch("http://127.0.0.1:5500/admin/data/foods.json")
            .then((response) => response.json())
            .then((data) => {
                foods = data;
                console.log("Alimentos cargadas:", foods);
            }),
        fetch("http://127.0.0.1:5500/admin/data/categories.json")
            .then((response) => response.json())
            .then((data) => {
                objCategories = data;
                console.log("Categorías cargadas:", objCategories);
            }),
        fetch("http://127.0.0.1:5500/admin/data/status.json")
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

    foods.forEach(function (elemento) {
        for (let i = 0; i < objCategories["alimentos"].length; i++) {
            if (objCategories["alimentos"][i].id == elemento.category) {
                category = objCategories["alimentos"][i].category;
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
            '<td>' + Number(foods.indexOf(elemento) + 1) + '</td>' +
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
    let rowsFood = document.querySelectorAll(".table-row");
    for (let i = 0; i < rowsFood.length; i++) {
        rowsFood[i].onclick = () => selectFood(i);
    }
}


async function getCreateFormElements() {
    let name = document.getElementById("name-food").value;
    let description = document.getElementById("description-food").value;
    let category = document.getElementById("category-food").value;
    let price = document.getElementById("price-food").value;
    let imageFoodCreate = document.getElementById("image-food");
    let file = imageFoodCreate.files[0];
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
        let newFood = {
            name,
            description,
            price,
            category,
            image,
            imageName, // Guardar el nombre del archivo
            status: 1
        };
        return newFood;
    } else {
        return null;
    }
}

async function getUpdateFormElements() {
    let name = document.getElementById("name-food-update").value;
    let description = document.getElementById("description-food-update").value;
    let category = document.getElementById("category-food-update").value;
    let price = document.getElementById("price-food-update").value;
    let status = document.getElementById("status-food-update").value;
    let imageFoodUpdate = document.getElementById("image-food-update");
    let file = imageFoodUpdate.files[0];
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

    if (name && description && category && price && status) {
        let updateFood = {
            name,
            description,
            price,
            category,
            image,
            imageName, // Guardar el nombre del archivo
            status
        };
        return updateFood;
    } else {
        return null;
    }
}



//modified

// Función para seleccionar un producto y llenar el modal de actualización
function selectFood(index) {
    let bebida = foods[index];
    document.getElementById("name-food-update").value = bebida.name;
    document.getElementById("description-food-update").value = bebida.description;
    document.getElementById("category-food-update").value = bebida.category;
    document.getElementById("price-food-update").value = bebida.price;
    document.getElementById("status-food-update").value = bebida.status;
    indexFoodSelected = index;
    let pCuurentImg = document.getElementById("p-current-image");
    pCuurentImg.textContent = `Imagen Actual: ${bebida.imageName}`;
}


function cleanFormCreate() {
    document.getElementById("name-food").value = "";
    document.getElementById("description-food").value = "";
    document.getElementById("category-food").value = "0";
    document.getElementById("price-food").value = "";
    document.getElementById("image-food").value = "";
}

function cleanFormUpdate() {
    document.getElementById("name-food-update").value = "";
    document.getElementById("description-food-update").value = "";
    document.getElementById("category-food-update").value = "0";
    document.getElementById("price-food-update").value = "";
    document.getElementById("image-food-update").value = "";
    document.getElementById("status-food-update").value = "0";
}


//Create preview Create
document.getElementById("btn-preview-create").addEventListener("click", previewCreate);

async function previewCreate() {
    var form = document.getElementById("form-create-food");
    if (form.checkValidity()) {
        let category;
        let status;
        const containerPreviewL = document.getElementById("img-preview-create");
        const containerPreviewR = document.getElementById("data-preview-create");
        let newFood = await getCreateFormElements();
        console.log(newFood)
        if (newFood) {
            for (let i = 0; i < objCategories["alimentos"].length; i++) {
                if (objCategories["alimentos"][i].id == newFood.category) {
                    category = objCategories["alimentos"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == newFood.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }
        containerPreviewL.innerHTML = `<img class="image-preview" src="${newFood.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${newFood.name}</h3>
        <p class="preview-desciption">${newFood.description}</p>
        <p class="preview-category">Categoría: ${category}</p>
        <p class="preview-status">Estatus: ${status ? "Activo" : "Inactivo"}</p>
        <p class="preview-price">Precio: $${newFood.price}MXN</p>`;
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
        let deleteFood = foods[indexFoodSelected];
        if (deleteFood) {
            for (let i = 0; i < objCategories["alimentos"].length; i++) {
                if (objCategories["alimentos"][i].id == deleteFood.category) {
                    category = objCategories["alimentos"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == deleteFood.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }
        containerPreviewL.innerHTML = `<img class="image-preview" src="${deleteFood.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${deleteFood.name}</h3>
        <p class="preview-desciption">${deleteFood.description}</p>
        <p class="preview-category">Categoría: ${category}</p>
        <p class="preview-status">Estatus: ${status ? "Activo" : "Inactivo"}</p>
        <p class="preview-price">Precio: $${deleteFood.price}MXN</p>`;
        $('#modal-update').modal('hide');
        $('#modal-preview-delete').modal('show');
}

//Create preview Update
document.getElementById("btn-preview-update").addEventListener("click", previewUpdate);

async function previewUpdate() {
    var form = document.getElementById("form-update-food");
    if (form.checkValidity()) {
        let category;
        let status;
        const containerPreviewL = document.getElementById("img-preview-update");
        const containerPreviewR = document.getElementById("data-preview-update");
        let updateFood = await getUpdateFormElements();
        if (updateFood) {
            for (let i = 0; i < objCategories["alimentos"].length; i++) {
                if (objCategories["alimentos"][i].id == updateFood.category) {
                    category = objCategories["alimentos"][i].category;
                    break;
                }
            }

            for (let i = 0; i < aStatus.length; i++) {
                if (aStatus[i].id == updateFood.status) {
                    status = aStatus[i].status;
                    break;
                }
            }
        }

        console.log(updateFood.image)
        containerPreviewL.innerHTML = `<img class="image-preview" src="${updateFood.image == null ? foods[indexFoodSelected].image : updateFood.image}" width="200"/>`;
        containerPreviewR.innerHTML =
            `<h3 class="preview-name">${updateFood.name}</h3>
            <p class="preview-desciption">${updateFood.description}</p>
            <p class="preview-category">Categoría: ${category}</p>
            <p class="preview-price">Precio: $${updateFood.price}MXN</p>
            <p class="preview-status">Status: ${status ? "Activo" : "Inactivo"}</p>`;
        $('#modal-update').modal('hide');
        $('#modal-preview-update').modal('show');
    }
    else {
        form.reportValidity();
    }


}

async function createFood() {
    let newFood = await getCreateFormElements();
    foods.push(newFood);
    console.log(foods)
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

async function updateFood() {
    let updateFood = await getUpdateFormElements();
    foods[indexFoodSelected].name = updateFood.name;
    foods[indexFoodSelected].description = updateFood.description;
    foods[indexFoodSelected].price = updateFood.price;
    foods[indexFoodSelected].category = updateFood.category;
    foods[indexFoodSelected].status = updateFood.status;
    foods[indexFoodSelected].imageName = updateFood.imageName || foods[indexFoodSelected].imageName;
    foods[indexFoodSelected].image = updateFood.image || foods[indexFoodSelected].image;
    cleanFormUpdate()
    updateTable();
    console.log(foods[indexFoodSelected]);
}


function deleteFood() {
    let nuevoArreglo = [];
    let elementoSeleccionado = foods[indexFoodSelected];
    foods.forEach(function (elemento) {
        if (elemento != elementoSeleccionado) {
            nuevoArreglo.push(elemento);
        }
    });
    foods = nuevoArreglo;
    updateTable();
}

function exportSelects() {
    const selectCategories = document.querySelectorAll(".select-categories");
    const selectStatus = document.getElementById("status-food-update");

    selectCategories.forEach(element => {
        let body = '';
        for (let i = 0; i < objCategories["alimentos"].length; i++) {
            if (i == 0 && element.getAttribute("id") == "category-food") {
                body += `<option value="">Selecciona una opcion...</option>`;
            } else {
                body += `<option value="${objCategories["alimentos"][i].id}">${objCategories["alimentos"][i].category}</option>`;
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