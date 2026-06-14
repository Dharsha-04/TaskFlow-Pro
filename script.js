document.addEventListener("DOMContentLoaded", () => {

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];

let taskChart = null;
let priorityChart = null;

/* ---------- NAVIGATION ---------- */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        document
            .querySelectorAll(".nav-link")
            .forEach(x => x.classList.remove("active"));

        link.classList.add("active");

        const page = link.dataset.page;

        document
            .querySelectorAll(".page")
            .forEach(p => p.classList.remove("active-page"));

        const target = document.getElementById(page);

        if (target) {
            target.classList.add("active-page");
        }

        const title = document.getElementById("pageTitle");

        if (title) {
            title.textContent =
                page.charAt(0).toUpperCase() +
                page.slice(1);
        }

    });

});

/* ---------- STORAGE ---------- */

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function saveGoals() {
    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );
}

/* ---------- TASKS ---------- */

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    if (!taskList) return;

    const search =
        document.getElementById("taskSearch")
            ?.value
            .toLowerCase() || "";

    const filter =
        document.getElementById("taskFilter")
            ?.value || "all";

    let filtered = [...tasks];

    if (search) {

        filtered = filtered.filter(task =>
            task.title.toLowerCase()
            .includes(search)
        );

    }

    switch (filter) {

        case "completed":
            filtered =
                filtered.filter(
                    t => t.completed
                );
            break;

        case "pending":
            filtered =
                filtered.filter(
                    t => !t.completed
                );
            break;

        case "high":
            filtered =
                filtered.filter(
                    t => t.priority === "High"
                );
            break;

        case "medium":
            filtered =
                filtered.filter(
                    t => t.priority === "Medium"
                );
            break;

        case "low":
            filtered =
                filtered.filter(
                    t => t.priority === "Low"
                );
            break;
    }

    taskList.innerHTML = "";

    if (!filtered.length) {

        taskList.innerHTML =
            "<p class='empty-text'>No tasks found</p>";

        return;
    }

    filtered.forEach(task => {

        const div =
            document.createElement("div");

        div.className = "task-card";

        div.innerHTML = `
            <div class="task-header">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    data-id="${task.id}"
                    class="task-checkbox">

                <div>
                    <button
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${task.id}">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm delete-btn"
                        data-id="${task.id}">
                        Delete
                    </button>
                </div>

            </div>

            <h5 class="${task.completed ? "task-completed" : ""}">
                ${task.title}
            </h5>

            <p>${task.description || ""}</p>

            <div class="task-footer">

    <div>

        <div>
            📅 ${task.date || ""}
        </div>

        <div>
            🕒 ${task.startTime || "--"} -
            ${task.endTime || "--"}
        </div>

    </div>

    <span class="priority-${task.priority.toLowerCase()}">
        ${task.priority}
    </span>

</div>
        `;

        taskList.appendChild(div);

    });

}

/* ---------- ADD TASK ---------- */

const saveTaskBtn =
    document.getElementById("saveTask");

if (saveTaskBtn) {

    saveTaskBtn.addEventListener("click", () => {

        const title =
            document.getElementById("taskTitle")
                ?.value.trim();

        if (!title) {
            alert("Task title required");
            return;
        }

        tasks.unshift({

    id: Date.now(),

    title,

    description:
        document.getElementById("taskDescription")
        ?.value || "",

    date:
        document.getElementById("taskDate")
        ?.value || "",

    startTime:
        document.getElementById("taskStartTime")
        ?.value || "",

    endTime:
        document.getElementById("taskEndTime")
        ?.value || "",

    priority:
        document.getElementById("taskPriority")
        ?.value || "Medium",

    completed: false

});

        saveTasks();

        renderTasks();

        renderRecentTasks();

        updateDashboard();

        updateAnalytics();

    });

}

/* ---------- TASK ACTIONS ---------- */

document.addEventListener("click", e => {

    if (e.target.classList.contains("delete-btn")) {

        const id =
            Number(e.target.dataset.id);

        tasks =
            tasks.filter(
                t => t.id !== id
            );

        saveTasks();

        renderTasks();

        renderRecentTasks();

        updateDashboard();

        updateAnalytics();
    }

});

document.addEventListener("change", e => {

    if (e.target.classList.contains("task-checkbox")) {

        const id =
            Number(e.target.dataset.id);

        const task =
            tasks.find(
                t => t.id === id
            );

        if (task) {

            task.completed =
                !task.completed;

            saveTasks();

            renderTasks();

            renderRecentTasks();

            updateDashboard();

            updateAnalytics();
        }

    }

});

/* Render recent tasks*/
function renderRecentTasks() {

    const container =
        document.getElementById("recentTasks");

    if (!container) return;

    if (tasks.length === 0) {

        container.innerHTML = `
            <p class="empty-text">
                No tasks created yet.
            </p>
        `;

        return;
    }

    container.innerHTML = "";

    tasks
        .slice(0, 5)
        .forEach(task => {

            container.innerHTML += `

                <div class="task-card mb-3">

                    <div class="d-flex justify-content-between">

                        <div>

                            <strong>
                                ${task.completed ? "✅" : "⬜"}
                                ${task.title}
                            </strong>

                            <div class="text-muted small">

                                ${task.date || ""}

                                <br>

                                ${task.startTime || "--"}
                                -
                                ${task.endTime || "--"}

                            </div>

                        </div>

                        <span class="priority-${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>

                    </div>

                </div>

            `;
        });
}

/* ---------- GOALS ---------- */

function renderGoals() {

    const goalList =
        document.getElementById("goalList");

    if (!goalList) return;

    goalList.innerHTML = "";

    goals.forEach(goal => {

        goalList.innerHTML += `
            <div class="goal-card">

                <div class="d-flex justify-content-between">

                    <h5>${goal.name}</h5>

                    <button
                    class="btn btn-danger btn-sm remove-goal"
                    data-id="${goal.id}">
                    Delete
                    </button>

                </div>

                <p>Target: ${goal.target}%</p>

            </div>
        `;
    });

}

const saveGoalBtn =
    document.getElementById("saveGoal");

if (saveGoalBtn) {

    saveGoalBtn.addEventListener("click", () => {

        const name =
            document.getElementById("goalName")
            ?.value.trim();

        if (!name) return;

        goals.push({

            id: Date.now(),

            name,

            target:
                document.getElementById("goalTarget")
                ?.value || 0

        });

        saveGoals();

        renderGoals();

    });

}

document.addEventListener("click", e => {

    if (e.target.classList.contains("remove-goal")) {

        const id =
            Number(e.target.dataset.id);

        goals =
            goals.filter(
                g => g.id !== id
            );

        saveGoals();

        renderGoals();

    }

});

/* ---------- DASHBOARD ---------- */

function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            t => t.completed
        ).length;

    const pending =
        total - completed;

    const percent =
        total === 0
        ? 0
        : Math.round(
            completed / total * 100
        );

    const setText = (id, value) => {

        const el =
            document.getElementById(id);

        if (el) el.textContent = value;

    };

    setText("totalTasks", total);
    setText("completedTasks", completed);
    setText("pendingTasks", pending);
    setText("progressPercent", percent + "%");

    const bar =
        document.getElementById("mainProgressBar");

    if (bar) {
        bar.style.width = percent + "%";
    }

}

/* ---------- ANALYTICS ---------- */

function updateAnalytics() {

    const taskCanvas =
        document.getElementById("taskChart");

    const priorityCanvas =
        document.getElementById("priorityChart");

    if (!taskCanvas || !priorityCanvas) return;

    const completed =
        tasks.filter(t => t.completed).length;

    const pending =
        tasks.length - completed;

    const high =
        tasks.filter(t => t.priority === "High").length;

    const medium =
        tasks.filter(t => t.priority === "Medium").length;

    const low =
        tasks.filter(t => t.priority === "Low").length;

    if (taskChart) taskChart.destroy();

    if (priorityChart) priorityChart.destroy();

    taskChart =
        new Chart(taskCanvas, {
            type: "doughnut",
            data: {
                labels: ["Completed","Pending"],
                datasets: [{
                    data: [completed,pending]
                }]
            }
        });

    priorityChart =
        new Chart(priorityCanvas, {
            type: "bar",
            data: {
                labels: ["High","Medium","Low"],
                datasets: [{
                    label: "Tasks",
                    data: [high,medium,low]
                }]
            }
        });

}

/* ---------- SEARCH ---------- */

document
.getElementById("taskSearch")
?.addEventListener("input", renderTasks);

document
.getElementById("taskFilter")
?.addEventListener("change", renderTasks);

/* ---------- INIT ---------- */

renderTasks();
renderGoals();
renderRecentTasks();
updateDashboard();
updateAnalytics();

});