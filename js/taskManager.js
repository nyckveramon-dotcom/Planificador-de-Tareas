class TaskManager {
    constructor(currentId = 0) {
        //se crea un arreglo vacio donde se guardaran las tareas
        this.tasks = [];

        //lleva el contador del ultimo id
        this.currentId = currentId;
    }

    //Este método se encarga de crear una nueva tarea con todos sus datos y guardarla en this.tasks
    addTask(titulo, descripcion, hora, fecha, categoria, prioridad) {
        //Se va sumando al contador para que el id vaya aumentando
        this.currentId++;

        //this.task.push agrega el objeto al final del arreglo
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
    //método para eliminar una tarea buscando por su id
    
    deleteTask(taskId){
        //arreglo temporal vacio donde irán las tareas que se quieren conservar
        const newTask = [];

        //Recorre las tareas que se tienen actualmente
        for(let task of this.tasks){
            if(task.id !== taskId){
                newTask.push(task);
            }
        }

        //reemplaza el anterior arreglo this.tasks por el nuevo arreglo newTask evidenciando la tarea eliminada
        this.tasks = newTask;
    }

    //método guarda el estado del navegador a pesar de que se recargue la página
    save(){

        //junta en un solo objeto el arreglo de tareas como tambien el currentId de manera que el ID no se repita
        const data = {
            tasks: this.tasks,
            currentId : this.currentId
        };
        //JSON.stringify(data) toma ese objeto y lo transforma en texto con formato JSON y luego esto se guarda en localStorage.setItem
        localStorage.setItem('taskManagerData', JSON.stringify(data));
    }
    
    //método para recuperar lo que estaba en localStorage
    load(){
        //busca si existe algo guardado con esta llave localStorage.getItem('taskManagerData')
        const savedData = localStorage.getItem('taskManagerData');

        //se entra al if solo si existe información guardada
        if(savedData){
            //realiza el proceso de convertir el texto en un objeto JS
            const parsedData = JSON.parse(savedData);

            //restaura las tareas y el contador
            this.tasks = parsedData.tasks || [];
            this.currentId = parsedData.currentId || 0;
        }
    }

    //función para ubicar la tarea por su id
    getTaskById(taskId){
        let foundTask;

        for(let task of this.tasks){
            if(task.id === taskId){
                foundTask = task;
            }
        }

        return foundTask;
    }
}

