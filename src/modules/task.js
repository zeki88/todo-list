let taskCount = -1;

const taskId = (function () {
  return function () {
    return taskCount += 1;
  };
}());

export function setTaskCount() {
  taskCount = JSON.parse(localStorage.getItem('taskId'));
}

export function CreateTask(task, day, priority) {
  this.task = task;
  this.day = day;
  this.priority = priority;
  this.id = taskId();
}
