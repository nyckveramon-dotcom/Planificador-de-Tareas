//se instancia de taskManager
const taskManager = new TaskManager();

//Se conecta los elementos del HTML
const contenedorTareas = document.getElementById('contenedorTareas');
const formularioNuevaTarea = document.getElementById('formularioNuevaTarea')


taskManager.load();
renderizarTareas();

function renderizarTareas() {
    contenedorTareas.innerHTML = '';
    //Se conecta el array utilizando taskManager para que emplee la misma logica,
    // pero ahora los datos se almacenan de forma centralizada en taskManager.task//

    taskManager.tasks.forEach(tarea => {
        const estaCompletada = tarea.status === 'COMPLETADA';

        // Icono si está completada o pendiente
        const iconoCheck = estaCompletada
            ? '<i class="bi bi-check-circle-fill text-success fs-5"></i>'
            : '<i class="bi bi-circle text-muted fs-5"></i>';

        //Se incluye este codigo que se encontraba vacio en el index para las tarjetas
        const tarjetaHTML = `
            <div class="card border-0 shadow-sm rounded-4 p-3 mb-2">
                <div class="row align-items-center">
            
                    <!-- Izquierda: Círculo, Título, Descripción, Fecha y Hora -->
                    <div class="col-md-6 d-flex align-items-center gap-3">
                        <button class="btn p-0 border-0 bg-transparent btn-completar" data-id="${tarea.id}">
                            ${iconoCheck}
                        </button>
                        <div>
                            <h6 class="fw-bold mb-0 ${estaCompletada ? 'text-decoration-line-through text-muted' : ''}">${tarea.titulo}</h6>
                            <p class="text-muted small mb-1">${tarea.descripcion || ''}</p>
                    
                            <!-- Se muestra fecha y hora -->
                            <div class="d-flex gap-3 text-muted small">
                                <span><i class="bi bi-calendar-event"></i> ${tarea.fecha}</span>
                                <span><i class="bi bi-clock"></i> ${tarea.hora}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Centro: Categoría y Prioridad -->
                    <div class="col-md-4 mt-2 mt-md-0">
                        <span class="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-normal">
                            ${tarea.categoria}
                        </span>
                        <span class="badge bg-warning bg-opacity-10 text-dark px-2 py-1 rounded-pill fw-normal ms-1">
                             ${tarea.prioridad}
                        </span>
                        <span class="badge ${estaCompletada ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'} px-2 py-1 rounded-pill fw-normal ms-1">
                            ${estaCompletada ? 'Completada' : 'Por hacer'}
                        </span>
                    </div>

                    <!-- Derecha: Menú de tres puntos -->
                    
                    <div class="col-md-2 text-end mt-2 mt-md-0">
                        <div class="dropdown">
                            <button class="btn btn-sm text-muted border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                                <li>
                                    <button type="button" class="dropdown-item text-danger delete-button" data-task-id="${tarea.id}" >
                                        Eliminar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        `;
        //se accede al espacio del HTML y se agrega la tarjeta con la función de JS
        contenedorTareas.innerHTML += tarjetaHTML;
    });

    activarEventosCheck();
    activarEventosEliminar();
}

//funcion para hacer interactivos los circulos del check
function activarEventosCheck() {
    const botonesCheck = document.querySelectorAll('.btn-completar');
    botonesCheck.forEach(btn => {
        btn.addEventListener('click', () => {
            const idTarea = parseInt(btn.getAttribute('data-id'));
            /*Esta línea le ordena a JavaScript que busque dentro de la lista de tareas aquella cuyo 
            ID coincida con el botón presionado, guardando el resultado en la constante tareaEncontrada*/
            const tareaEncontrada = taskManager.tasks.find(tareaIndividual => tareaIndividual.id === idTarea);

            //se valida si la tarea encotrada se encuentra por hacer que el evento la marque completada
            //y si la tarea encontrada esta completada se puede hacer el evento de marcarse por hacer
            if (tareaEncontrada) {
                if (tareaEncontrada.status === 'COMPLETADA') {
                    tareaEncontrada.status = 'PORHACER';
                } else {
                    tareaEncontrada.status = 'COMPLETADA';
                }

                taskManager.save();
                renderizarTareas();
            }
        });
    });
}

//función para activar el boton Eliminar dentro del menú de 3 puntos

function activarEventosEliminar(){
    const botonesEliminar = document.querySelectorAll('.delete-button');

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const taskId = Number(event.currentTarget.dataset.taskId);
            taskManager.deleteTask(taskId);
            renderizarTareas();
        });
    });
}

//evento para capturar los datos del modal y guardarlos

formularioNuevaTarea.addEventListener('submit', function (e) {
    e.preventDefault();//evitar que se recargue la pagina 

    //se obtienen los valores escritos en el formulario//

    const nuevoTitulo = document.getElementById('tituloTarea').value;
    const nuevaDescripcion = document.getElementById('descripcionTarea').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;
    const nuevaFecha = document.getElementById('fechaTarea').value;
    const nuevaCategoria = document.getElementById('categoriaTarea').value;
    const nuevaPrioridad = document.getElementById('prioridadTarea').value;
    const alertaError = document.getElementById('alertaError');

    //se valida primero con un objeto con las constantes
    const esValido = validFormFieldInput({
        titulo: nuevoTitulo,
        descripcion: nuevaDescripcion,
        horaInicio: horaInicio,
        horaFin: horaFin,
        fecha: nuevaFecha,
        categoria: nuevaCategoria,
        prioridad: nuevaPrioridad
    })

    if (!esValido) {
        alertaError.classList.remove('d-none');
        return
    }
    alertaError.classList.add('d-none');

    //Objeto de la nueva tarea a través de taskManager//

    const horario = `${horaInicio} - ${horaFin}`;

    taskManager.addTask(
        nuevoTitulo,
        nuevaDescripcion,
        horario,
        nuevaFecha,
        nuevaCategoria,
        nuevaPrioridad
    )

    //Se actualiza la pantalla y persisten los datos
    taskManager.save();
    renderizarTareas();

    //Se limpia el modal y se cierra el modal
    formularioNuevaTarea.reset();
    const modalElement = document.getElementById('modalNuevaTarea');
    const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
    modalBootstrap.hide();
})

//Validaciones

function validFormFieldInput(data) {
    //Si se cumple alguna de estas condiciones es porque existe un error en el formulario
    if (
        !data.titulo || data.titulo.trim() === "" ||
        !data.descripcion || data.descripcion.trim() === "" ||
        !data.horaInicio || data.horaInicio.trim() === "" ||
        !data.horaFin || data.horaFin.trim() === "" ||
        !data.fecha || data.fecha.trim() === "" ||
        !data.categoria || data.categoria === "Seleccionar" || data.categoria === "" ||
        !data.prioridad || data.prioridad === "Seleccionar" || data.prioridad === ""
    ) {
        return false; //los datos faltan o son inválidos
    }
    return true; //Retorna verdadero si todo cumple
}
