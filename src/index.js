import { createNewProject, createUI } from './modules/projectUI';
import { projects, setProjectCount } from './modules/project';
import { switchTask } from './modules/taskUI';
import { setTaskCount } from './modules/task';

import css from './output.css';

const form = document.getElementById('form');
const buttonAddProject = document.getElementById('add-project');
const blur = document.getElementById('blur');
const projectForm = document.getElementById('project-form');
const storedProjects = JSON.parse(localStorage.getItem('Projects'));

function handleFormSubmit(e) {
  e.preventDefault();

  createNewProject();

  blur.classList.add('hidden');
  projectForm.classList.add('hidden');

  e.currentTarget.reset();
}

form.addEventListener('submit', handleFormSubmit);

function showProjectForm() {
  blur.classList.remove('hidden');
  projectForm.classList.remove('hidden');
}

function updateTasks() {
  setTaskCount();
  switchTask(storedProjects[storedProjects.length - 1].id);
}

function updateProjects() {
  storedProjects.forEach((project) => {
    projects.push(project);
    createUI(project);
  });

  setProjectCount();
}

buttonAddProject.addEventListener('click', showProjectForm);

updateProjects();
updateTasks();
