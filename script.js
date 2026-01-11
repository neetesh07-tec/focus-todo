const addTaskInput = document.getElementById("add-task");
const timeValueInput = document.querySelector(".time-value");
const timeUnitInput = document.querySelector(".time-unit");
const creaateBtn = document.querySelector(".create");
const runningCount = document.getElementById("running-count");
const taskList = document.getElementById("task-list");

let tasks = [];

function convertToSeconds(value, unit){
    if (unit ==="Hrs") return value * 3600;
    if (unit === "Days") return value * 86400;
    if (unit === "Weeks") return value *604800;
    return 0;
}


function formating(seconds){
     const h = Math.floor(seconds / 3600);
     const m = Math.floor((seconds % 3600) / 60);
     const s = seconds % 60;

     return `${h}hrs: ${m}mins: ${s}sec`;
}


// adding task 
 function addTask(){
    const title = addTaskInput.value.trim();
    const value = Number(timeValueInput.value);
    const unit = timeUnitInput.value;
    if (!title){
        alert("Please enter task and time");
        return;
    }
    tasks.push({
        id: Date.now(),
        title,
        remaningTime: convertToSeconds(value, unit),
        status: "running"
    });
    renderTask();
    clearInput();
    updateRunningCount();

 }

 setInterval(startTimer, 1000);

 function startTimer(){
    tasks.forEach(task =>{
        if(task.status === "running"){
            task.remaningTime--;
            if (task.remaningTime <= 0){
                task.remaningTime = 0;
                task.status = "completed";
            }   
        }
    });
    renderTask();
 }



 function renderTask(){
    taskList.innerHTML = "";
    tasks.forEach(task =>{
        const card = document.createElement("div");
        card.classList.add("task-card");
        card.innerHTML = `
        <h4>${task.title}</h4>
        <p>Time Left: ${formating(task.remaningTime)}</p>
        <button class = "delete-btn">Delete</button>
        `;
        card.querySelector(".delete-btn").addEventListener('click', function(){
            deleteTask(task.id);
        })
        taskList.appendChild(card); 
        
    })
}

function updateRunningCount(){
    const runningTask = `${tasks.length} tasks running`;
    runningCount.textContent = runningTask;
}




function deleteTask(id){
     tasks = tasks.filter(t => t.id !== id);
    renderTask();

}



function clearInput(){
    addTaskInput.value = "";
    timeValueInput.value = "";
    timeUnitInput.value = "";
}



document.querySelector(".create").addEventListener('click', function(){
    addTask();
})