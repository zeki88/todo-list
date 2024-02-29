import { CreateProject, getProjectFromId, projects } from './project';
import {
  newTask, resetTaskDiv,
  switchTask,
  getAllTask,
  getTasksForToday,
  getTasksForThisWeek,
} from './taskUI';

const projectNav = document.getElementById('project-nav');
const buttonDeleteProject = document.getElementById('project-delete');
const projectName = document.getElementById('project-name');
const buttonNewTask = document.getElementById('new-task');
const allTodos = document.getElementById('all-todos');
const todayTodos = document.getElementById('today-todos');
const thisWeekTodos = document.getElementById('week-todos');

buttonDeleteProject.addEventListener('click', deleteProject);
buttonNewTask.addEventListener('click', newTask);
allTodos.addEventListener('click', getAllTodos);
todayTodos.addEventListener('click', getTodayTodos);
thisWeekTodos.addEventListener('click', getThisWeekTodos);

function getAllTodos() {
  projectName.textContent = 'All Todos';
  buttonNewTask.classList.add('hidden');
  getAllTask();
}

function getTodayTodos() {
  projectName.textContent = 'Today';
  buttonNewTask.classList.add('hidden');
  getTasksForToday();
}

function getThisWeekTodos() {
  projectName.textContent = 'This week';
  buttonNewTask.classList.add('hidden');
  getTasksForThisWeek();
}

export function createUI(newProject) {
  const projectButton = createProjectButton(newProject.id);
  buttonNewTask.dataset.index = newProject.id;
  buttonDeleteProject.dataset.index = newProject.id;
  projectName.textContent = newProject.name;
  projectButton.id = `project-button-id-${newProject.id}`;
  projectNav.append(projectButton);
  checkProjectsLength();
  switchTask(newProject.id);
}
export function createNewProject() {
  const name = document.getElementById('project');
  const newProject = new CreateProject(name.value);
  createUI(newProject);

  localStorage.setItem('Projects', JSON.stringify(projects));
  localStorage.setItem('projectId', newProject.id);
}

function deleteProject(e) {
  if (e.target.classList.contains('fa-trash-can')) {
    const projectIndex = getProjectIndex(e);
    if (projectIndex === undefined) {
      return;
    }

    projectNav.removeChild(
      document.getElementById(`project-button-id-${projectIndex}`),
    );

    const project = getProjectFromId(projectIndex);
    if (!project) {
      return;
    }
    const projectIndexInArray = projects.indexOf(project);
    projects.splice(projectIndexInArray, 1);

    checkProjectsLength();
    if (projects[projects.length - 1] === undefined) {
      projectName.textContent = '';
    }

    try {
      localStorage.setItem('Projects', JSON.stringify(projects));
    } catch (error) {
      return;
    }

    if (projects[projects.length - 1]) {
      e.currentTarget.dataset.index = projects[projects.length - 1].id;
      switchProject(e);
    }
  }
}

function createProjectButton(projectId) {
  const projectButton = document.createElement('button');
  const name = document.createElement('span');
  const buttonDelete = document.createElement('i');
  const projectIcon = document.createElement('i');
  const projectButtonDiv = document.createElement('div');

  projectButton.classList.add(
    'text-left',
    'mt-1',
    'mb-1',
    'flex',
    'justify-between',
    'focus:bg-cyan-600',
    'focus:text-white',
    'text-slate-600',
    'hover:text-white',
    'hover:bg-gray-900',
    'text-lg',
    'dark:to-black',
    'dark:hover:bg-cyan-500',
  );
  projectButtonDiv.classList.add('text-ellipsis', 'overflow-hidden');
  buttonDelete.classList.add(
    'mr-2',
    'ml-2',
    'fa-solid',
    'fa-trash-can',
    'self-center',
  );
  projectIcon.classList.add('fa-solid', 'fa-list-check', 'self-center');

  projectButton.dataset.index = projectId;
  buttonDelete.dataset.index = projectId;

  const project = projects.find((o) => o.id === projectId);
  if (project) {
    name.textContent = project.name;
  } else {
    resetTaskDiv();
    return null;
  }

  projectButton.addEventListener('click', switchProject);
  buttonDelete.addEventListener('click', deleteProject);

  projectButtonDiv.append(projectIcon, name);
  projectButton.append(projectButtonDiv, buttonDelete);

  return projectButton;
}

function switchProject(e) {
  const projectId = getProjectIndex(e);
  if (projectId === undefined) {
    return;
  }

  buttonNewTask.dataset.index = projectId;
  buttonDeleteProject.dataset.index = projectId;

  const project = projects.find((o) => o.id === Number(projectId));
  if (!project) {
    resetTaskDiv();
    return;
  }
  projectName.textContent = project.name;

  checkProjectsLength();
  switchTask(projectId);
}

function getProjectIndex(e) {
  return e.currentTarget.dataset.index;
}

function checkProjectsLength() {
  if (projects.length > 0) {
    buttonNewTask.classList.remove('hidden');
  } else {
    buttonNewTask.classList.add('hidden');
  }
}
