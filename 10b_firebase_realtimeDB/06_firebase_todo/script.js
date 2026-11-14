import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const statusMessage = document.querySelector("#status");

// Copy your app settings from Firebase Console.
const firebaseConfig = {
  apiKey: "---",
  authDomain: "---",
  databaseURL: "---",
  projectId: "---",
  storageBucket: "---",
  messagingSenderId: "---",
  appId: "---"
};

let tasksRef;

function showStatus(message) {
  statusMessage.textContent = message;
}

function renderTasks(tasks) {
  taskList.replaceChildren();

  const taskEntries = Object.entries(tasks || {});
  if (taskEntries.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No tasks yet. Add a task.";
    taskList.append(emptyMessage);
    return;
  }

  for (const [taskId, task] of taskEntries) {
    const item = document.createElement("li");
    item.className = task.completed ? "task completed" : "task";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle";
    toggleButton.dataset.id = taskId;
    toggleButton.textContent = task.completed ? "Undo" : "Done";
    toggleButton.setAttribute("aria-label", `${task.text} ${toggleButton.textContent}`);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = taskId;
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `${task.text} Delete`);

    actions.append(toggleButton, deleteButton);
    item.append(text, actions);
    taskList.append(item);
  }
}

function startFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    tasksRef = ref(database, "classroom/tasks");

    // Draw the list when data at this path changes.
    onValue(
      tasksRef,
      snapshot => {
        renderTasks(snapshot.val());
        showStatus("Connected. Changes in other windows appear here.");
      },
      error => {
        showStatus(`Could not read the data: ${error.message}`);
      }
    );
  } catch (error) {
    showStatus(`Check your Firebase settings: ${error.message}`);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    showStatus("Enter a task.");
    taskInput.focus();
    return;
  }

  if (!tasksRef) {
    showStatus("Check your Firebase settings first.");
    return;
  }

  try {
    // push() makes a task ID. set() saves the task.
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, { text, completed: false });
    form.reset();
    taskInput.focus();
  } catch (error) {
    showStatus(`Could not save the task: ${error.message}`);
  }
});

taskList.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button || !tasksRef) {
    return;
  }

  const taskRef = ref(tasksRef, button.dataset.id);

  try {
    if (button.dataset.action === "delete") {
      // remove() deletes the chosen task.
      await remove(taskRef);
    } else if (button.dataset.action === "toggle") {
      const completed = button.textContent === "Done";
      // update() changes the done state and keeps the text.
      await update(taskRef, { completed });
    }
  } catch (error) {
    showStatus(`Could not change the task: ${error.message}`);
  }
});

startFirebase();
