import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  signOut
} from "./firebase.js";

const taskInput = document.getElementById("todo-input");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout");
const addBtn = document.getElementById("add-task");

let currentUser;

// ✅ Check auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await loadTasks();
  } else {
    window.location.href = "auth.html";
  }
});

// ✅ Create task
taskInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && taskInput.value.trim()) {
    const taskText = taskInput.value.trim();

    const taskRef = collection(db, "users", currentUser.uid, "tasks");
    await addDoc(taskRef, {
      title: taskText,
      completed: false,
      important: false,
      due: "Today",
      createdAt: Date.now()
    });

    taskInput.value = "";
    await loadTasks();
  }
});


addBtn.addEventListener("click",async()=>{
  taskInput.focus()
  
  const taskText = taskInput.value.trim();

  if (taskText) {
    
    const taskRef = collection(db, "users", currentUser.uid, "tasks");
    await addDoc(taskRef, {
      title: taskText,
      completed: false,
      important: false,
      due: "Today",
      createdAt: Date.now()
    });

    taskInput.value = "";
    await loadTasks();
  }
})


// ✅ Load tasks
async function loadTasks() {
  taskList.innerHTML = "";

  const tasksRef = collection(db, "users", currentUser.uid, "tasks");
  const snapshot = await getDocs(tasksRef);

  snapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const taskId = docSnap.id;

  const taskHTML = `
  <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition" data-task-id="${taskId}">
    <div class="flex items-center gap-3">
      <input type="checkbox" class="w-5 h-5 text-blue-600" data-id="${taskId}" ${task.completed ? "checked" : ""} />
      <div>
        <p class="task-title text-gray-800 font-medium ${task.completed ? "line-through text-gray-400" : ""}">${task.title}</p>
        <input type="text" class="edit-input hidden border rounded p-1 mt-1 w-full" value="${task.title}" />
        <span class="text-sm text-gray-500">${task.due}</span>
      </div>
    </div>
    <div class="flex gap-2">
      <span class="text-xl cursor-pointer ${task.important ? "text-yellow-400" : "text-gray-300"}" data-star-id="${taskId}">&#9733;</span>
      <button class="text-blue-500 text-sm" data-edit-id="${taskId}">✏️</button>
      <button class="text-red-500 text-sm" data-del-id="${taskId}">🗑️</button>
    </div>
  </div>
`;


    taskList.insertAdjacentHTML("beforeend", taskHTML);
  });

  attachTaskEvents();
}

// ✅ Attach events to dynamic tasks
function attachTaskEvents() {
  // ✅ Mark complete
  document.querySelectorAll("input[type='checkbox']").forEach((cb) => {
    cb.addEventListener("change", async () => {
      const id = cb.dataset.id;
      await updateDoc(doc(db, "users", currentUser.uid, "tasks", id), {
        completed: cb.checked
      });
      loadTasks();
    });
  });

  // ✅ Toggle important
  document.querySelectorAll("[data-star-id]").forEach((star) => {
    star.addEventListener("click", async () => {
      const id = star.dataset.starId;
      const isImportant = star.classList.contains("text-yellow-400");
      await updateDoc(doc(db, "users", currentUser.uid, "tasks", id), {
        important: !isImportant
      });
      loadTasks();
    });
  });

  // ✅ Edit task
  document.querySelectorAll("[data-edit-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.editId;
      const taskDiv = btn.closest("[data-task-id]");
      const titleEl = taskDiv.querySelector(".task-title");
      const inputEl = taskDiv.querySelector(".edit-input");

      titleEl.classList.add("hidden");
      inputEl.classList.remove("hidden");
      inputEl.focus();

      inputEl.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && inputEl.value.trim()) {
          await updateDoc(doc(db, "users", currentUser.uid, "tasks", id), {
            title: inputEl.value.trim()
          });
          loadTasks();
        }
      });

      inputEl.addEventListener("blur", () => {
        titleEl.classList.remove("hidden");
        inputEl.classList.add("hidden");
      });
    });
  });

  // ✅ Delete task
  document.querySelectorAll("[data-del-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delId;
      await deleteDoc(doc(db, "users", currentUser.uid, "tasks", id));
      loadTasks();
    });
  });
}


// ✅ Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "auth.html";
  });
});
