window.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("to-add");
    let addBtn = document.getElementById("add");
    let deleteAll = document.getElementById("deleteAll");
    let list = document.getElementById("list-task");


    addBtn.classList.add("btn", "btn-outline-success", "btn-sm", "mx-2");
    deleteAll.classList.add("btn", "btn-outline-danger", "btn-sm", "mx-2");
    // Styling the list container dynamically
    list.style.cssText = `
        margin-top: 4rem;
        background: #FFF;
        width: 100%;
        height: 300px;
        overflow-y: scroll;  
        border: 1px solid white;
        border-radius: 12px;
        box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
        padding: 10px;
    `;

    // Array of background and text colors
    let arr = [
        { bg: "bg-ref" },
        { bg: "bg-sf"},
        { bg: "bg-bf" },
    
     
     
        { bg: "bg-light", text: "text-dark" }
    ];

    function toDo(event) {
        let inputVal = input.value.trim();

        if (event.target.id === "add") {
            if (inputVal === "") {
                alert("Please enter a task!");
                return;
            }

            // Create list item
            let listItem = document.createElement("li");
            listItem.style.listStyle = "none";
            listItem.style.padding = "10px";
            listItem.style.borderRadius = "8px";
            listItem.style.display = "flex";
            listItem.style.alignItems = "center";
            listItem.style.justifyContent = "space-between";
            listItem.style.marginBottom = "10px";

            // Apply a random background color
            let randomColor = Math.floor(Math.random() * arr.length);
            listItem.classList.add(arr[randomColor].bg,"text-dark");
           

            // Create checkbox
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("mx-2");
            checkbox.addEventListener("change", CutTask);

            // Create input field (task text)
            let taskText = document.createElement("input");
            taskText.type = "text";
            taskText.value = inputVal;
            taskText.classList.add("text-black");
            taskText.disabled = true;
            taskText.style.border = "none";
            taskText.style.outline = "none";
            taskText.style.background = "inherit";
            taskText.style.flex = "1";
            taskText.style.marginLeft = "10px";

            // Create Edit button
            let editBtn = document.createElement("button");
            editBtn.classList.add("btn", "btn-outline-success", "btn-sm", "mx-2");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", function () {
                if (taskText.disabled) {
                    taskText.disabled = false;
                    taskText.focus();
                    editBtn.textContent = "Update";
                } else {
                    taskText.disabled = true;
                    editBtn.textContent = "Edit";
                }
            });

            // Create Delete button
            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function () {
                listItem.remove();
            });

            // Append elements
            listItem.appendChild(checkbox);
            listItem.appendChild(taskText);
            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);

            // Clear input field
            input.value = "";
        } else {
            list.innerHTML = "";
        }
    }

    function CutTask(event) {
        let taskText = event.target.nextSibling;
        let parentElement = event.target.parentElement;

        if (event.target.checked) {
            parentElement.classList.remove("bg-success", "bg-secondary", "bg-warning", "bg-primary", "bg-light");

          
            taskText.style.textDecoration = "line-through";
            taskText.style.color = "gray";
            parentElement.classList.add("bg-warning", "border-warning", "border-1");
        } else {
           
            parentElement.classList.remove("bg-warning", "border-warning", "border-1");

         
            taskText.style.textDecoration = "none";
            taskText.style.color = "black";

         
            let randomColor = Math.floor(Math.random() * arr.length);
          
        }
    }

    addBtn.addEventListener("click", toDo);
    deleteAll.addEventListener("click", toDo);
});
