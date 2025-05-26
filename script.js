const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTaskElement(taskText);
    inputBox.value = "";
    saveData();
}

function createTaskElement(taskText, isChecked = false) {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.innerText = taskText;
    li.appendChild(textSpan);

    if (isChecked) li.classList.add("checked");

    // Edit button
    const editBtn = document.createElement("span");
    editBtn.className = "edit";
    editBtn.innerText = "✎";
    editBtn.title = "Edit Task";
    editBtn.onclick = () => editTask(textSpan, li);
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete";
    deleteBtn.innerText = "×";
    deleteBtn.title = "Delete Task";
    deleteBtn.onclick = () => {
        li.remove();
        saveData();
    };
    li.appendChild(deleteBtn);

    li.onclick = function (e) {
        // Avoid toggling checked if edit or delete was clicked
        if (e.target === textSpan) {
            li.classList.toggle("checked");
            saveData();
        }
    };

    listContainer.appendChild(li);
}

function editTask(textSpan, li) {
    const originalText = textSpan.innerText;
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.className = "edit-input";

    // Replace span with input
    li.replaceChild(input, textSpan);
    input.focus();

    // Save on blur or Enter key
    input.onblur = () => saveEdit(input, li);
    input.onkeypress = (e) => {
        if (e.key === "Enter") saveEdit(input, li);
    };
}

function saveEdit(input, li) {
    const newText = input.value.trim();
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.innerText = newText || "Untitled Task";
    textSpan.onclick = () => li.classList.toggle("checked");

    li.replaceChild(textSpan, input);
    saveData();
}

function saveData() {
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(li => {
        const text = li.querySelector(".task-text")?.innerText || "";
        const checked = li.classList.contains("checked");
        tasks.push({ text, checked });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
    listContainer.innerHTML = "";
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => createTaskElement(task.text, task.checked));
}

showTasks();
