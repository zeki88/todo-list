import { format, parseISO } from 'date-fns';
import { projects, createNewTask, getProjectFromId } from './project';

const taskForm = document.getElementById('task-form');
const inputTaskName = document.getElementById('task-name');
const inputTaskDay = document.getElementById('task-day');
const inputTaskPriority = document.getElementById('task-priority');
const buttonAddTask = document.getElementById('add-task');
const taskContainer = document.getElementById('task-container');
const buttonConfirmTask = document.getElementById('edit-task');
const blur = document.getElementById('blur');
let currentTaskId = 0;

taskForm.addEventListener('submit', handleFormSubmit);

export function newTask(e) {
  createTaskUI(e.currentTarget.dataset.index);
}

function createTaskUI(project) {
  buttonAddTask.classList.remove('hidden');
  blur.classList.remove('hidden');
  showInputs();
  taskForm.dataset.indexProject = project;
  buttonAddTask.dataset.indexProject = project;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const index = taskForm.dataset.indexProject;

  if (e.submitter.id === 'add-task') {
    addTask(index);
  } else if (e.submitter.id === 'edit-task') {
    confirmEdit(index);
  }
}

function addTask(index) {
  const task = createNewTask(
    inputTaskName.value,
    inputTaskDay.value,
    inputTaskPriority.value,
    index,
  );
  switchTask(index);
  resetUIAfterTaskCreation();
  localStorage.setItem('taskId', task.id);
  updateLocalStorage();
}

function resetUIAfterTaskCreation() {
  hideInputs();
  blur.classList.add('hidden');
  buttonAddTask.classList.add('hidden');
}

function clearInputs() {
  inputTaskName.value = '';
  inputTaskDay.value = '';
  inputTaskPriority.value = 'Low';
}

function editTask(e) {
  buttonConfirmTask.classList.remove('hidden');
  blur.classList.remove('hidden');
  showInputs();
  currentTaskId = getTaskIndex(e);
}

function confirmEdit(e) {
  buttonConfirmTask.classList.add('hidden');
  hideInputs();
  blur.classList.add('hidden');
  changeTaskInfo(getTask(currentTaskId));
  updateLocalStorage();
}

function deleteTask(e) {
  e.preventDefault();
  const { arrayTask } = getProject(getTaskIndex(e));
  const project = getProject(getTaskIndex(e));
  arrayTask.splice(arrayTask.indexOf(getTask(getTaskIndex(e))), 1);
  switchTask(project.id);
  updateLocalStorage();
}

function showInputs() {
  clearInputs();
  taskForm.classList.remove('hidden');
}

function hideInputs() {
  taskForm.classList.add('hidden');
}
function createDeleteButton(e) {
  const button = document.createElement('i');
  button.classList.add('text-white', 'place-content-center', 'place-items-center', 'p-1', 'w-4', 'h-4', 'place-self-center', 'text-[0.5rem]', 'justify-center', 'bg-cyan-700', 'hover:bg-cyan-800', 'focus:ring-2', 'focus:ring-cyan-300', 'rounded', 'text-center', 'dark:bg-cyan-600', 'dark:hover:bg-cyan-700', 'dark:focus:ring-cyan-900');
  button.classList.add('fa-regular', 'fa-trash-can');
  button.dataset.index = e.id;
  button.addEventListener('click', deleteTask);
  button.dataset.indexProject = getProject(e.id).id;
  return button;
}

function createEditButton(e) {
  const button = document.createElement('i');
  button.addEventListener('click', editTask);
  button.classList.add('text-white', 'place-content-center', 'place-items-center', 'p-1', 'w-4', 'h-4', 'place-self-center', 'text-[0.5rem]', 'justify-center', 'bg-cyan-700', 'hover:bg-cyan-800', 'focus:ring-2', 'focus:ring-cyan-300', 'rounded', 'text-center', 'dark:bg-cyan-600', 'dark:hover:bg-cyan-700', 'dark:focus:ring-cyan-900');
  button.classList.add('fa-solid', 'fa-pen-to-square');
  button.dataset.index = e.id;
  button.dataset.indexProject = getProject(e.id).id;
  return button;
}

function updateLocalStorage() {
  localStorage.setItem('Projects', JSON.stringify(projects));
}

export function switchTask(e) {
  resetTaskDiv();
  loadTaskDiv(e);
}

export function getAllTask() {
  resetTaskDiv();

  projects.forEach((e) => {
    e.arrayTask.forEach((o) => {
      getTaskInfo(o);
    });
  });
}

export function resetTaskDiv() {
  let child = taskContainer.lastElementChild;
  while (child) {
    taskContainer.removeChild(child);
    child = taskContainer.lastElementChild;
  }
}

function loadTaskDiv(e) {
  const project = projects.find((o) => o.id === Number(e));

  project.arrayTask.forEach((task) => {
    getTaskInfo(task);
  });
}

function getTaskInfo(e) {
  const taskDiv = document.createElement('div');
  const taskChek = document.createElement('input');
  const taskName = document.createElement('div');
  const taskDay = document.createElement('div');
  const taskPriority = document.createElement('div');
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');

  if (e.day === '') {
    taskDay.textContent = '';
  } else {
    const date = parseISO(e.day);
    const formattedDate = format(date, 'dd-MM-yyyy');
    taskDay.textContent = `Due date: ${formattedDate}`;
  }

  taskName.textContent = e.task;

  taskPriority.textContent = `Priority: ${e.priority}`;
  taskChek.type = 'checkbox';
  taskDiv.classList.add('flex', 'gap-2', 'hover:bg-cyan-100', 'justify-between');
  div1.classList.add('flex', 'gap-2');
  div2.classList.add('flex', 'gap-2');

  taskContainer.append(taskDiv);
  taskDiv.append(div1, div2);
  div1.append(taskChek, taskName);
  div2.append(taskDay, taskPriority, createEditButton(e), createDeleteButton(e));
}

function changeTaskInfo(task) {
  task.task = inputTaskName.value;
  task.day = inputTaskDay.value;
  task.priority = inputTaskPriority.value;
  switchTask(getProject(task.id).id);
}

function getTaskIndex(e) {
  return e.currentTarget.dataset.index;
}

function getProjectIndex(e) {
  return e.dataset.indexProject;
}

function getProject(e) {
  return projects.find((o) => o.arrayTask.find((i) => i.id === Number(e)));
}

function getTask(e) {
  return getProject(e).arrayTask.find((o) => o.id === Number(e));
}

export function getTasksForToday() {
  resetTaskDiv();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasksForToday = [];

  projects.forEach((project) => {
    project.arrayTask.forEach((task) => {
      const taskDate = parseISO(task.day);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate.getTime() === today.getTime()) {
        getTaskInfo(task);
      }
    });
  });

  return tasksForToday;
}

export function getTasksForThisWeek() {
  resetTaskDiv();
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
  ));
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  firstDayOfWeek.setHours(0, 0, 0, 0);
  lastDayOfWeek.setHours(0, 0, 0, 0);

  projects.forEach((project) => {
    project.arrayTask.forEach((task) => {
      const taskDate = parseISO(task.day);
      taskDate.setHours(0, 0, 0, 0);
      if (taskDate >= firstDayOfWeek && taskDate <= lastDayOfWeek) {
        getTaskInfo(task);
      }
    });
  });
}
