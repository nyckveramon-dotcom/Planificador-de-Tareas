class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }
    addTask(titulo, descripcion, hora, fecha, categoria, prioridad) {
        this.currentId++;

        this.tasks.push({
            id: this.currentId,
            titulo: titulo,
            descripcion: descripcion,
            hora: hora,
            fecha: fecha,
            categoria: categoria,
            prioridad: prioridad,
            status: 'PORHACER'
        });

    }
}

