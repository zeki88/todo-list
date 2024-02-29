import { CreateTask } from './task';

export const projects = [];

let projectCount = -1;

export function CreateProject(name) {
  this.name = name;
  const projectId = getId();
  this.id = projectId;
  const arrayTask = [];
  this.arrayTask = arrayTask;
  projects.push(this);
}

export const getId = (function () {
  return function () {
    return projectCount += 1;
  };
}());

export function setProjectCount() {
  projectCount = JSON.parse(localStorage.getItem('projectId'));
}

export function createNewTask(task, day, priority, id) {
  const newTask = new CreateTask(task, day, priority);
  getProjectFromId(id).arrayTask.push(newTask);
  return newTask;
}

export function destroyProject() {

}

export function getProjectFromId(e) {
  return projects.find((o) => o.id === Number(e));
}
