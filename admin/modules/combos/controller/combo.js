let foods = [];
let drinks = [];
let combos = [];
let status = [];
let selectedComboId = null;

function toggleSearchFields() {
    let searchFields = document.getElementById('search-fields');
    if (searchFields.style.display === 'none' || searchFields.style.display === '') {
        searchFields.style.display = 'block';
    } else {
        searchFields.style.display = 'none';
    }
}
function searchCombos() {
    let name = document.getElementById('search-name').value.toLowerCase();
    let alimentos = document.getElementById('search-alimentos').value.toLowerCase();
    let bebidas = document.getElementById('search-bebidas').value.toLowerCase();

    console.log("Buscando con los siguientes criterios:");
    console.log("Nombre:", name);
    console.log("Alimentos:", alimentos);
    console.log("Bebidas:", bebidas);

    let filteredCombos = combos.filter(combo => {
        let nameMatch = combo.nombre.toLowerCase().includes(name);
        let alimentosMatch = alimentos === '' || combo.alimento.toLowerCase().includes(alimentos);
        let bebidasMatch = bebidas === '' || combo.bebida.toLowerCase().includes(bebidas);

        console.log(`Combo: ${combo.nombre} - Name Match: ${nameMatch}, Alimentos Match: ${alimentosMatch}, Bebidas Match: ${bebidasMatch}`);

        return nameMatch && alimentosMatch && bebidasMatch;
    });

    console.log("Combos filtrados:", filteredCombos);

    loadCombos(filteredCombos);
}

window.onload = function() {
    cargarDatos();
    
    document.getElementById('btn-create').addEventListener('click', mostrarModalConfirmacion);
    document.getElementById('btn-no').addEventListener('click', function() {
        $('#modal-preview').modal('hide');
        $('#modal-create').modal('show');
    });
     // Event listener para el botón de búsqueda
    document.getElementById('btn-search').addEventListener('click', searchCombos);
    document.querySelector('.button-create').addEventListener('click', toggleSearchFields);
    };
    


function cargarDatos() {
    return Promise.all([
        fetch("https://elzarape.github.io/admin/data/foods.json")
            .then(response => response.json())
            .then(data => {
                foods = data;
                console.log("Foods cargados:", foods);
                llenarSelectsFoods();
            }),
        fetch("https://elzarape.github.io/admin/data/drinks.json")
            .then(response => response.json())
            .then(data => {
                drinks = data;
                console.log("Drinks cargados:", drinks);
                llenarSelectsDrinks();
            }),
        fetch("https://elzarape.github.io/admin/data/combos.json")
            .then(response => response.json())
            .then(data => {
                combos = data;
                console.log("Combos cargados:", combos);
                llenarTablaCombos();
            }),
        fetch("https://elzarape.github.io/admin/data/status.json")
            .then(response => response.json())
            .then(data => {
                status = data;
                console.log("Estatus cargados:", status);
            })
    ]);
}

async function llenarSelectsFoods(initialize = false) {
    const containerCreate = document.getElementById('combo-foods-container');
    const containerUpdate = document.getElementById('update-combo-foods-container');

    if (!containerCreate) {
        console.error("Contenedor de alimentos para crear no encontrado.");
        return;
    }

    if (!containerUpdate) {
        console.error("Contenedor de alimentos para actualizar no encontrado.");
        return;
    }

    if (!Array.isArray(foods) || foods.length === 0) {
        console.error("No se encontraron alimentos.");
        return;
    }

    if (initialize) {
        containerCreate.innerHTML = '';
        containerUpdate.innerHTML = '';
    }

    foods.forEach(food => {
        if (food.name) {
            const labelCreate = document.createElement('label');
            const checkboxCreate = document.createElement('input');
            checkboxCreate.type = 'checkbox';
            checkboxCreate.name = 'food';
            checkboxCreate.value = food.name;

            labelCreate.appendChild(checkboxCreate);
            labelCreate.appendChild(document.createTextNode(food.name));
            containerCreate.appendChild(labelCreate);

            // Crear checkbox para actualización
            const labelUpdate = document.createElement('label');
            const checkboxUpdate = document.createElement('input');
            checkboxUpdate.type = 'checkbox';
            checkboxUpdate.name = 'food';
            checkboxUpdate.value = food.name;

            labelUpdate.appendChild(checkboxUpdate);
            labelUpdate.appendChild(document.createTextNode(food.name));
            containerUpdate.appendChild(labelUpdate);
        } else {
            console.error("El alimento no tiene nombre:", food);
        }
    });
}
function llenarSelectsDrinks() {
    const containerCreate = document.getElementById('combo-drinks-container');
    const containerUpdate = document.getElementById('update-combo-drinks-container');

    if (!containerCreate) {
        console.error("Contenedor de bebidas para crear no encontrado.");
    }

    if (!containerUpdate) {
        console.error("Contenedor de bebidas para actualizar no encontrado.");
    }

    if (!Array.isArray(drinks) || drinks.length === 0) {
        console.error("No se encontraron bebidas.");
        return;
    }

    if (containerCreate) {
        containerCreate.innerHTML = '';
    }

    if (containerUpdate) {
        containerUpdate.innerHTML = '';
    }

    drinks.forEach(drink => {
        if (drink.name) {
            if (containerCreate) {
                const labelCreate = document.createElement('label');
                const checkboxCreate = document.createElement('input');
                checkboxCreate.type = 'checkbox';
                checkboxCreate.name = 'drink';
                checkboxCreate.value = drink.name;

                labelCreate.appendChild(checkboxCreate);
                labelCreate.appendChild(document.createTextNode(drink.name));
                containerCreate.appendChild(labelCreate);
            }

            if (containerUpdate) {
                const labelUpdate = document.createElement('label');
                const checkboxUpdate = document.createElement('input');
                checkboxUpdate.type = 'checkbox';
                checkboxUpdate.name = 'drink';
                checkboxUpdate.value = drink.name;

                labelUpdate.appendChild(checkboxUpdate);
                labelUpdate.appendChild(document.createTextNode(drink.name));
                containerUpdate.appendChild(labelUpdate);
            }
        } else {
            console.error("La bebida no tiene nombre:", drink);
        }
    });
}
function loadCombos(filteredCombos) {
    llenarTablaCombos(filteredCombos);
}
function llenarTablaCombos(combosParaMostrar = combos) {
    const tbody = document.getElementById('combo-table-body');
    tbody.innerHTML = '';

    combosParaMostrar.forEach((combo, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index + 1; // Asignar el número de fila al atributo data-index

        const tdIndex = document.createElement('td');
        tdIndex.textContent = index + 1;

        const tdNombre = document.createElement('td');
        tdNombre.textContent = combo.nombre;

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = combo.descripcion;

        const tdAlimento = document.createElement('td');
        tdAlimento.textContent = combo.alimento || 'N/A';

        const tdBebida = document.createElement('td');
        tdBebida.textContent = combo.bebida || 'N/A';

        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = `$${combo.precio.toFixed(2)}`;

        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.className = 'table__item-img';
        img.src = combo.foto.startsWith('data:') ? combo.foto : `../../../../assets/css/img/combos/${combo.foto}`;
        img.alt = combo.nombre;
        img.style.width = '100px';
        tdImagen.appendChild(img);

        const tdEstatus = document.createElement('td');
        tdEstatus.textContent = status.find(s => s.id == combo.estatus)?.status ? 'Activo' : 'Inactivo';

        tr.appendChild(tdIndex);
        tr.appendChild(tdNombre);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdAlimento);
        tr.appendChild(tdBebida);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdImagen);
        tr.appendChild(tdEstatus);

        tbody.appendChild(tr);

        // Agregar un manejador de clic a la fila
        tr.addEventListener('click', function() {
            const comboIndex = this.dataset.index; // Obtener el número de fila desde el atributo data-index
            mostrarModalActualizar(parseInt(comboIndex)); 
        });
    });
}


function mostrarModalConfirmacion() {
    if (!validarCampos()) {
        return;
    }
    llenarVistaPrevia();
    $('#modal-preview').modal('show');
    $('#modal-create').modal('hide');
}


function llenarVistaPrevia() {
    const nombre = document.getElementById('combo-name').value;
    const descripcion = document.getElementById('combo-description').value;
    const alimentos = Array.from(document.querySelectorAll('#combo-foods-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const bebidas = Array.from(document.querySelectorAll('#combo-drinks-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const precio = parseFloat(document.getElementById('combo-price').value);
    const fileInput = document.getElementById('combo-image');
    const file = fileInput.files[0];

    document.getElementById('data-preview-create').innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <p><strong>Alimentos:</strong> ${alimentos || 'N/A'}</p>
        <p><strong>Bebidas:</strong> ${bebidas || 'N/A'}</p>
        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
    `;

    if (file) {
        obtenerImagenBase64(file).then(base64 => {
            document.getElementById('img-preview-create').innerHTML = `<img src="${base64}" style="width: 200px; height: 200px;" />`;
        });
    } else {
        document.getElementById('img-preview-create').innerHTML = 'No image selected';
    }
}

function validarCampos() {
    const nombre = document.getElementById('combo-name');
    const descripcion = document.getElementById('combo-description');
    const precio = document.getElementById('combo-price');
    const fileInput = document.getElementById('combo-image');
    const file = fileInput.files[0];

    if (nombre.value.trim() === '') {
        alert('Por favor, ingresa un nombre para el combo.');
        return false;
    }

    if (descripcion.value.trim() === '') {
        alert('Por favor, ingresa una descripción para el combo.');
        return false;
    }

    if (isNaN(parseFloat(precio.value)) || parseFloat(precio.value) <= 0) {
        alert('Por favor, ingresa un precio válido para el combo.');
        return false;
    }

    if (!file) {
        alert('Por favor, selecciona una imagen para el combo.');
        return false;
    }
    return true;
    
}
async function createCombo() {
    if (!validarCampos()) {
        return;
    }

    const nombre = document.getElementById('combo-name').value;
    const descripcion = document.getElementById('combo-description').value;
    const alimento = Array.from(document.querySelectorAll('#combo-foods-container input:checked')).map(checkbox => checkbox.value);
    const drinksSeleccionadas = Array.from(document.querySelectorAll('#combo-drinks-container input:checked')).map(checkbox => checkbox.value);
    const precio = parseFloat(document.getElementById('combo-price').value);
    const fileInput = document.getElementById('combo-image');
    const file = fileInput.files[0];
    let foto = '';

    if (file) {
        try {
            foto = await obtenerImagenBase64(file);
        } catch (error) {
            console.error('Error al obtener la imagen en base64:', error);
        }
    }

    const nuevoCombo = { 
        nombre,
        descripcion,
        alimento: alimento.join(', '),
        bebida: drinksSeleccionadas.join(', '),
        precio,
        foto,
        estatus: status[0].id 
    };

    combos.push(nuevoCombo);
    $('#modal-preview').modal('hide');
    $('#modal-create').modal('hide');
    llenarTablaCombos();
    resetCreateForm();
    
}
function resetCreateForm() {

    document.getElementById('combo-name').value = '';
    document.getElementById('combo-description').value = '';
    document.getElementById('combo-price').value = '';
    

    document.querySelectorAll('#combo-foods-container input').forEach(checkbox => {
        checkbox.checked = false;
    });


    document.querySelectorAll('#combo-drinks-container input').forEach(checkbox => {
        checkbox.checked = false;
    });
    


    document.getElementById('combo-image').value = ''; 
    document.getElementById('img-preview').innerHTML = 'No image selected'; 

    document.getElementById('status').value = status[0].id; 


    $('#modal-create').modal('hide');
}

function obtenerImagenBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function mostrarModalActualizar(index) {
    console.log('Número de fila recibido para actualización:', index);

    const combo = combos[index - 1];
    if (combo) {
        console.log('Combo encontrado:', combo);
        document.getElementById('update-combo-id').value = index;
        document.getElementById('update-combo-name').value = combo.nombre;
        document.getElementById('update-combo-description').value = combo.descripcion;
        document.getElementById('update-combo-price').value = combo.precio;
        document.getElementById('update-combo-status').value = combo.estatus;

        
        llenarSelectsFoods(true);
        llenarSelectsDrinks(true);
        const alimentosSeleccionados = combo.alimento.split(', ').map(a => a.trim().toLowerCase());
        document.querySelectorAll('#update-combo-foods-container input').forEach(checkbox => {
            checkbox.checked = alimentosSeleccionados.includes(checkbox.value.trim().toLowerCase());
        });

        const bebidasSeleccionadas = combo.bebida.split(', ').map(b => b.trim().toLowerCase());
        document.querySelectorAll('#update-combo-drinks-container input').forEach(checkbox => {
            checkbox.checked = bebidasSeleccionadas.includes(checkbox.value.trim().toLowerCase());
        });

        
        if (combo.foto) {
            document.getElementById('img-preview-update').innerHTML = `<img src="${combo.foto}" style="width: 200px; height: 200px;" />`;
        } else {
            document.getElementById('img-preview-update').innerHTML = 'No image selected';
        }

        $('#modal-update').modal('show');
    } else {
        console.error('Combo no encontrado para el índice:', index);
    }
}

function mostrarModalConfirmacionUpdate() {
    llenarVistaPreviaUpdate();
    $('#modal-preview-update').modal('show');
    console.log('Mostrando hide ...');

}




function llenarVistaPreviaUpdate() {
    const nombre = document.getElementById('update-combo-name').value;
    const descripcion = document.getElementById('update-combo-description').value;
    const alimentos = Array.from(document.querySelectorAll('#update-combo-foods-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const bebidas = Array.from(document.querySelectorAll('#update-combo-drinks-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const precio = parseFloat(document.getElementById('update-combo-price').value);
    const fileInput = document.getElementById('update-combo-image');
    const file = fileInput.files[0];
    console.log(file);
    console.log(fileInput);
    const estatus = document.getElementById('update-combo-status').value;

    document.getElementById('data-preview-update').innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <p><strong>Alimentos:</strong> ${alimentos || 'N/A'}</p>
        <p><strong>Bebidas:</strong> ${bebidas || 'N/A'}</p>
        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
        <p><strong>Estatus:</strong> ${estatus === '1' ? 'Activo' : 'Inactivo'}</p>
    `;
    if (file) {
        obtenerImagenBase64(file).then(base64 => {
            document.getElementById('img-preview-update').innerHTML = `<img src="${base64}" style="width: 200px; height: 200px;" />`;
        });
    } else {
        const existingImageSrc = document.querySelector('#img-preview-update img')?.src;
        document.getElementById('img-preview-update').innerHTML = existingImageSrc ? `<img src="${existingImageSrc}" style="width: 200px; height: 200px;" />` : 'No image selected';
        
        
    }
}
function regresarAlModalUpdate() {
    $('#modal-preview-update').modal('hide'); 
    $('#modal-update').modal('show'); 
}
function updateCombo() {
    const comboIndex = parseInt(document.getElementById('update-combo-id').value);
    const combo = combos[comboIndex - 1];
    
    if (!combo) {
        console.error('Combo no encontrado en el índice:', comboIndex);
        return;
    }
    const nombre = document.getElementById('update-combo-name').value;
    const descripcion = document.getElementById('update-combo-description').value;
    const alimento = Array.from(document.querySelectorAll('#update-combo-foods-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const bebida = Array.from(document.querySelectorAll('#update-combo-drinks-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const precio = parseFloat(document.getElementById('update-combo-price').value);
    const estatus = document.getElementById('update-combo-status').value;
    const fileInput = document.getElementById('update-combo-image');
    const file = fileInput.files[0];

    if (file) {
        obtenerImagenBase64(file).then(base64 => {
            combo.foto = base64;
            aplicarActualizacion(combo, nombre, descripcion, alimento, bebida, precio, estatus);
        }).catch(error => {
            console.error('Error al obtener la imagen base64:', error);
        });
    } else {
        aplicarActualizacion(combo, nombre, descripcion, alimento, bebida, precio, estatus);
    }
}


function aplicarActualizacion(combo, nombre, descripcion, alimento, bebida, precio, estatus) {
    combo.nombre = nombre;
    combo.descripcion = descripcion;
    combo.alimento = alimento;
    combo.bebida = bebida;
    combo.precio = precio;
    combo.estatus = estatus;

    console.log('Actualizando combo:', combo);
    llenarTablaCombos();
    $('#modal-preview-update').modal('hide');
}

function resetUpdateForm() {
    document.getElementById('update-combo-name').value = '';
    document.getElementById('update-combo-description').value = '';
    document.getElementById('update-combo-price').value = '';
    

    document.querySelectorAll('#update-combo-foods-container input').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll('#update-combo-drinks-container input').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('update-combo-image').value = '';
    document.getElementById('img-preview-update').innerHTML = 'No image selected';


    document.getElementById('update-combo-status').value = '0'; 
    document.getElementById('update-combo-id').value = '';
}

/*
function confirmDeleteCombo(id) {
    document.getElementById('update-combo-id').value = id;
    llenarVistaPreviaDelete();
    $('#modal-preview-delete').modal('show');
}

function llenarVistaPreviaDelete() {
    const comboIndex = parseInt(document.getElementById('update-combo-id').value, 10);
    const combo = combos.find(c => c.id === comboIndex);
    
    if (!combo) {
        console.error('Combo no encontrado con el ID:', comboIndex);
        return;
    }

    // Llenar la vista previa del modal con los detalles del combo
    document.getElementById('data-preview-delete').innerHTML = `
        <p><strong>Nombre:</strong> ${combo.nombre}</p>
        <p><strong>Descripción:</strong> ${combo.descripcion}</p>
        <p><strong>Alimentos:</strong> ${combo.alimento || 'N/A'}</p>
        <p><strong>Bebidas:</strong> ${combo.bebida || 'N/A'}</p>
        <p><strong>Precio:</strong> $${combo.precio.toFixed(2)}</p>
        <p><strong>Estatus:</strong> ${combo.estatus === '1' ? 'Activo' : 'Inactivo'}</p>
    `;

    if (combo.foto) {
        document.getElementById('img-preview-delete').innerHTML = `<img src="${combo.foto}" style="width: 200px; height: 200px;" />`;
    } else {
        document.getElementById('img-preview-delete').innerHTML = 'No image available';
    }
}

function eliminarCombo() {
    const comboIndex = parseInt(document.getElementById('update-combo-id').value, 10);
    const comboPosition = combos.findIndex(c => c.id === comboIndex);

    if (comboPosition !== -1) {
        // Eliminar el combo del arreglo
        combos.splice(comboPosition, 1);
        actualizarTabla();
        $('#modal-preview-delete').modal('hide');
    } else {
        console.error('No se pudo eliminar el combo, ID no encontrado:', comboIndex);
    }
}

function actualizarTabla() {
    const tabla = document.getElementById('combo-table');
    tabla.innerHTML = ''; // Vaciar la tabla antes de llenarla

    combos.forEach(combo => {
        tabla.innerHTML += `
            <tr>
                <td>${combo.id}</td>
                <td>${combo.nombre}</td>
                <td>${combo.descripcion}</td>
                <td>${combo.alimento || 'N/A'}</td>
                <td>${combo.bebida || 'N/A'}</td>
                <td>$${combo.precio.toFixed(2)}</td>
                <td>${combo.estatus === '1' ? 'Activo' : 'Inactivo'}</td>
                <td><button onclick="confirmDeleteCombo(${combo.id})">Eliminar</button></td>
            </tr>
        `;
    });
}
    */
function confirmDeleteCombo() {
    llenarVistaPreviaDelete();
    console.log('Mostrando modal de vista previa delete...');
    $('#modal-preview-delete').modal('show');
    
}

function llenarVistaPreviaDelete() {
    const comboIndex = parseInt(document.getElementById('update-combo-id').value) - 1;
    const combo = combos[comboIndex];
    
    if (!combo) {
        console.error('Combo no encontrado en el índice:', comboIndex);
        return;
    }

    const nombre = document.getElementById('update-combo-name').value;
    const descripcion = document.getElementById('update-combo-description').value;
    const alimentos = Array.from(document.querySelectorAll('#update-combo-foods-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const bebidas = Array.from(document.querySelectorAll('#update-combo-drinks-container input:checked')).map(checkbox => checkbox.value).join(', ');
    const precio = parseFloat(document.getElementById('update-combo-price').value);
    const fileInput = document.getElementById('update-combo-image');
    
    const file = fileInput.files[0];
    console.log(file);
    console.log(fileInput);
    const estatus = document.getElementById('update-combo-status').value;

    document.getElementById('data-preview-delete').innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <p><strong>Alimentos:</strong> ${alimentos || 'N/A'}</p>
        <p><strong>Bebidas:</strong> ${bebidas || 'N/A'}</p>
        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
        <p><strong>Estatus:</strong> ${estatus === '1' ? 'Activo' : 'Inactivo'}</p>
    `;
    
    if (combo.foto) {
        document.getElementById('img-preview-delete').innerHTML = `<img src="${combo.foto}" style="width: 200px; height: 200px;" />`;
    } else {
        document.getElementById('img-preview-delete').innerHTML = 'No image selected';
    }
}


function eliminarCombo() {
    const comboIndex = parseInt(document.getElementById('update-combo-id').value) - 1;
    const combo = combos[comboIndex];
    
    if (!combo) {
        console.error('Combo no encontrado en el índice:', comboIndex);
        return;
    }

    // Elimina el combo del array
    combos.splice(comboIndex, 1);

    // Reordena los IDs de los combos restantes
    combos.forEach((c, index) => c.id = index + 1);

    console.log('Eliminando combo:', combo);
    llenarTablaCombos();
    $('#modal-preview-delete').modal('hide');
    $('#modal-update').modal('hide');

}
function regresarAlModalDelete() {
    $('#modal-preview-delete').modal('hide');
    $('#modal-update').modal('show');
}

