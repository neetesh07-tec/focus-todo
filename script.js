const addTaskInput = document.getElementById("add-task");
const timeValueInput = document.querySelector(".time-value");
const timeUnitInput = document.querySelector(".time-unit");
const creaateBtn = document.querySelector(".create");
const runningCount = document.getElementById("running-count");
const taskList = document.getElementById("task-list");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    renderTask();
  }
}

function convertToSeconds(value, unit) {
  if (unit === "Hrs") return value * 3600;
  if (unit === "Days") return value * 86400;
  if (unit === "Weeks") return value * 604800;
  return 0;
}

function formating(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${h}hrs: ${m}mins: ${s}sec`;
}

// adding task
function addTask() {
  const title = addTaskInput.value.trim();
  const value = Number(timeValueInput.value);
  const unit = timeUnitInput.value;
  if (!title) {
    alert("Please enter task and time");
    return;
  }
  tasks.push({
    id: Date.now(),
    title,
    duration: convertToSeconds(value, unit),
    startTime: Date.now(),
    status: "running",
  });
  saveTasks();
  clearInput();
  renderTask();
//   updateRunningCount();
}

// setInterval(startTimer, 1000);

// function startTimer() {
//   tasks.forEach((task) => {
//     if (task.status === "running") {
//       task.remaningTime--;
//       if (task.remaningTime <= 0) {
//         task.remaningTime = 0;
//         task.status = "completed";
//         deleteTask();
//       }
//     }
//   });
//   saveTasks();
//   renderTask();
// }

function renderTask() {
  taskList.innerHTML = "";
  const now = Date.now();

  tasks.forEach((task) => {

    const elapsed = Math.floor((now - task.startTime) / 1000);
        let remaining = task.duration - elapsed;

        if (remaining <= 0) {
            remaining = 0;
            task.status = "completed";
        }

    const card = document.createElement("div");
    card.classList.add("task-card");
    card.innerHTML = `
        <h4>${task.title}</h4>
        <p>Time Left: ${formating(remaining)}</p>
        <button class = "delete-btn">Delete</button>
        `;
    card.querySelector(".delete-btn").addEventListener("click", function () {
      deleteTask(task.id);
    });
    taskList.appendChild(card);
  });

  updateRunningCount();
}



function updateRunningCount() {
  const running = tasks.filter(t => t.status === "running").length;
  runningCount.textContent = `${running} tasks running`;
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  updateRunningCount();
  renderTask();
}

function clearInput() {
  addTaskInput.value = "";
  timeValueInput.value = "";
  timeUnitInput.value = "Hrs";
}

document.querySelector(".create").addEventListener("click", function () {
  addTask();
});

loadTasks();
setInterval(renderTask, 1000);
