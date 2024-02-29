const projects = {};

function newProject (name) {

    this.name = name
    const taskObject = {};
    this.taskObject = taskObject
    const projectId =  getId();
    this.id = projectId
    projects[this.id] = this;
    
    function addTask (task, day, hour, priority) {
        const thistask = new createTask (task, day, hour, priority, projectId);
        return thistask.taskId;
    }

    this.createTask = addTask;

    this.erase = function () {
        delete projects[this.id];
    };
}

function createTask (task, day, hour, priority, project) {
    this.task = task;
    this.day = day;
    this.hour = hour;
    this.priority = priority;
    this.taskId = taskId();
    projects[project].taskObject[this.taskId] = this
    this.erase = function () {
        delete projects[project].taskObject[this.taskId];
    };
}

const getId = (function() {
    let count = 0
    return function() {
        return 'id' + count++;
      }
}());

const taskId = (function() {
    let count = 0
    return function() {
        return 'id' + count++;
      }
}());

const btnCrear = document.getElementById('crear');
const nombre = document.getElementById('project')
const form = document.getElementById('form')
const content = document.getElementById('content')

form.addEventListener ('submit', (e) => {
    e.preventDefault();
    nuevoProjecto();
    
})

function nuevoProjecto () {
    const projectNuevo = new newProject(nombre.value)
    const projectDiv = document.createElement('div')
    const projectName = document.createElement('div')
    const btn = document.createElement('button')
    const btnCrearTask = document.createElement('button')
    

    projectName.textContent = projectNuevo.name
    btn.textContent = 'borrar'
    btnCrearTask.textContent = 'agregar tarea'
    content.append(projectDiv)
    projectDiv.append(projectName, btn, btnCrearTask)

    btn.addEventListener ('click', ()=> {
        projectNuevo.erase()
        projectDiv.remove()
    })

    btnCrearTask.addEventListener ('click', ()=> {
        const tareaDiv = document.createElement('div')
        const formaTarea = document.createElement('form')
        const inputTareaNombre = document.createElement('input')
        const inputTareaDia = document.createElement('input')
        const inputTareaHora = document.createElement('input')
        const inputTareaPrioridad = document.createElement('input')
        const btnTarea = document.createElement('button')
        const btnBTarea = document.createElement('button')
    
        btnTarea.textContent = 'crear tarea'
        btnBTarea.textContent = 'borrar tarea'
    
        projectDiv.append(tareaDiv)
        tareaDiv.append(formaTarea)
        formaTarea.append(inputTareaNombre, inputTareaDia, inputTareaHora, inputTareaPrioridad, btnTarea)
    
        btnTarea.addEventListener ('click', (e)=> {
            e.preventDefault();
            const task = projectNuevo.createTask(inputTareaNombre.value, inputTareaDia.value, inputTareaHora.value, inputTareaPrioridad.value)
            const taskInfo = `Tarea: ${inputTareaNombre.value} Dia: ${inputTareaDia.value} Hora: ${inputTareaHora.value} Prioridad: ${inputTareaPrioridad.value}`

            formaTarea.append(taskInfo)
            formaTarea.append(btnBTarea)
            formaTarea.removeChild(inputTareaNombre)
            formaTarea.removeChild(inputTareaDia)
            formaTarea.removeChild(inputTareaHora)
            formaTarea.removeChild(inputTareaPrioridad)
            formaTarea.removeChild(btnTarea)
            

    
            btnBTarea.addEventListener ('click', (e)=> {
                e.preventDefault();
                projectNuevo.taskObject[task].erase();
                tareaDiv.remove()
            })
        })
    })

    
}