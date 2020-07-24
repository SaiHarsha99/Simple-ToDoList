import "./styles.css";
import $ from "jquery";

var todo = [];

document.getElementById("toadd").addEventListener("click", function() {
  document.getElementById("toadd").style.display = "none";
  document.getElementById("hiding").style.display = "block";
  document.getElementById("formhide").style.display = "inline";
});

document.getElementById("formhide").addEventListener("click", function() {
  document.getElementById("hiding").style.display = "none";
  document.getElementById("formhide").style.display = "none";
  document.getElementById("toadd").style.display = "";
});

var todoList = {
  todos: [],
  addTodo: function(Title, User, Description) {
    this.todos.push({
      title: Title,
      user: User,
      description: Description,
      completed: false
    });
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  deleteCompletedTodos: function() {
    // Count backwards to avoid index problem when deleting todos.
    for (var i = this.todos.length - 1; i >= 0; i--) {
      if (this.todos[i].completed === true) {
        this.deleteTodo(i);
      }
    }
  },
  toggleCompleted: function(todo) {
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    // Count number of completed todos.
    this.todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    });
    if (completedTodos === totalTodos) {
      todoList.todos.forEach(function(todo) {
        todo.completed = false;
      });
    } else {
      todoList.todos.forEach(function(todo) {
        todo.completed = true;
      });
    }
  },
  updateLocalStorage: function() {
    localStorage.setItem("todos", JSON.stringify(todoList.todos));
  },
  getLocalStorage: function() {
    if (localStorage.getItem("todos") !== null) {
      todoList.todos = JSON.parse(localStorage.getItem("todos"));
    }
  }
};

var handlers = {
  new: function() {
    var Title = document.getElementById("user").value;
    var User = document.getElementById("title").value;
    var Description = document.getElementById("description").value;
    // Test if addTodoTextInput.value is not empty and not just whitespace before adding it as a todo.
    document.getElementById("title").value = " ";
    document.getElementById("user").value = " ";
    document.getElementById("description").value = " ";
    todoList.addTodo(Title, User, Description);
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  viewTodo: function(data, position) {
    todoList.viewTodo(data, position);
    view.displayTodos();
  },
  deleteCompletedTodos: function() {
    todoList.deleteCompletedTodos();
    view.displayTodos();
  },
  toggleCompleted: function(todo) {
    todoList.toggleCompleted(todo);
    view.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }
};

var view = {
  selectedFilter: "showAllTodos",
  filteredTodos: [],
  searchtodos: function(data) {
    var todosUl = document.getElementById("todos");
    document.getElementById("search-text").value = "";
    if (data === "No Data") {
      // Empty the list before updating it.
      todosUl.innerHTML = "";
    } else {
      todosUl.innerHTML = "";
      todosUl.appendChild(data);
    }
  },
  displayTodos: function() {
    var todosUl = document.getElementById("todos");

    // Filter todos based on selectedFilter.
    view.filterTodos();

    // Empty the list before updating it.
    todosUl.innerHTML = "";

    // Create todo elements from todoList.todos and display them.
    view.filteredTodos.forEach(function(todo, position) {
      var todoLi = document.createElement("li");
      var checkbox = this.createCheckbox(todo);
      var todoLabel = this.createTodoLabel(todo);

      todoLi.className = "todo";

      todoLi.appendChild(checkbox);
      todoLi.append(todoLabel[0]);
      todosUl.appendChild(todoLi);

      // If todo is completed, set checkbox to true and give the li its 'checked' class.
      if (todo.completed === true) {
        checkbox.querySelector("input").checked = true;
        todoLabel[0].classList.add("todo-checked-text");
        let i = todo.elementReference;
        let j = view.getTodoElementIndex(i);
        $("[class=viewButton]")[j].style.display = "none";
      }

      todo.elementReference = todoLi;
    }, this);
    this.checkTodosCompletion();
    todoList.updateLocalStorage();
  },
  filterTodos: function() {
    switch (view.selectedFilter) {
      case "showAllTodos":
        view.filteredTodos = todoList.todos;
        break;
      case "showUncompletedTodos":
        view.filteredTodos = todoList.todos.filter(function(todo) {
          return todo.completed === false;
        });
        break;
      case "showCompletedTodos":
        view.filteredTodos = todoList.todos.filter(function(todo) {
          return todo.completed === true;
        });
        break;
      default:
        view.filteredTodos = todoList.todos;
        break;
    }
  },
  createCheckbox: function() {
    // for pretty-checkbox.css
    var checkboxMain = document.createElement("div");
    var checkbox = document.createElement("input");
    var checkboxState = document.createElement("div");
    var checkboxIcon = document.createElement("i");
    var checkboxLabel = document.createElement("label");

    checkboxMain.className = "pretty p-icon p-round";
    checkboxState.className = "state";
    checkboxIcon.className = "icon mdi mdi-check mdi-18px";

    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    checkboxState.appendChild(checkboxIcon);
    checkboxState.appendChild(checkboxLabel);
    checkboxMain.appendChild(checkbox);
    checkboxMain.appendChild(checkboxState);
    return checkboxMain;
  },
  createTodoLabel: function(todo) {
    var $newdiv = $(
      "<div class='taskcontent'>" +
        "<div class='edit'>" +
        "<strong id='title'>" +
        todo.user +
        "</strong>" +
        "<div>" +
        todo.title +
        "</div>" +
        "</div>" +
        "</div>"
    );
    var $newdescr = $(
      "<div class='description edit'>" +
        "Description: " +
        todo.description +
        "</div>"
    );
    var $newEditButton = $(
      "<button class='viewButton'  style='display:block;' >View Task</button>"
    );
    var $displaying = $(
      '<div id="hidebuttons" style="display:none"><button id="pending">Pending Task</button><button id="editButton">Edit Task</button><button id="delButton" class="delete-button">Delete Task</button></div>'
    );

    let button = this.createDeleteButton();

    $newdiv
      .append($newEditButton)
      .append($newdescr)
      .append(button)
      .append($displaying);

    return $newdiv;
  },
  createDeleteButton: function() {
    var closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.className = "close-button";
    return closeButton;
  },
  checkTodosCompletion: function() {
    var totalTodos = todoList.todos.length;
    var completedTodos = 0;
    var toggleAllButton = document.getElementById("toggleAll");
    var deleteCompletedButton = document.getElementById(
      "deleteCompletedButton"
    );
    var todosLeftLabel = document.getElementById("todosLeft");
    todoList.todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    });

    var uncompletedTodos = totalTodos - completedTodos;

    // If all todos are completed, add 'toggle-all-checked' class to toggleAll button.
    if (completedTodos === totalTodos && totalTodos > 0) {
      toggleAllButton.classList.add("toggle-all-checked");
    } else {
      toggleAllButton.classList.remove("toggle-all-checked");
    }
    // If at least one todo is completed, show Clear completed button, otherwise don't display it.
    switch (completedTodos) {
      case 0:
        deleteCompletedButton.style.display = "none";
        break;
      default:
        deleteCompletedButton.style.display = "initial";
        break;
    }
    // Update todosLeft label with the number of uncompleted todos.
    switch (uncompletedTodos) {
      case 0:
        todosLeftLabel.textContent = "";
        break;
      default:
        todosLeftLabel.textContent = "Todos left: " + uncompletedTodos;
    }
  },
  // Find the todo's element reference inside the todos array which matches argument element and then return it's index.
  getTodoElementIndex: function(todoElement) {
    var todo = todoList.todos.find(function(todo) {
      return todo.elementReference === todoElement;
    });
    return todoList.todos.indexOf(todo);
  },
  setUpEventListeners: function() {
    var addTodoTextInput = document.getElementById("addTodoTextInput");
    var todoMenu1 = document.getElementById("todoMenu1");
    var todosUl = document.getElementById("todos");
    var todoMenu2 = document.getElementById("todoMenu2");
    var searchInList = document.getElementById("search-text");

    // Make todos lose focus on Enter.
    searchInList.addEventListener("keypress", function(event) {
      var elementClicked = event.target;
      var todosUl = document.getElementsByClassName("todo");
      let flag = true;
      if (event.key === "Enter") {
        elementClicked.blur();
        var str = document.getElementById("search-text").value.toLowerCase();
        for (var j = 0; j < todosUl.length; j++) {
          if (todo[j].includes(str)) {
            flag = false;
            view.searchtodos($("[class=todo]")[j]);
            break;
          }
        }
        if (flag) {
          view.searchtodos("No Data");
        }
      }
    });
    $("#todos").on("click", ".close-button", function(e) {
      let i = view.getTodoElementIndex(e.target.parentNode.parentNode);
      $("[id=hidebuttons]")[i].style.display = "none";
      $("[class=viewButton]")[i].style.display = "block";
      $("[class=close-button]")[i].style.display = "none";
    });

    $("#todos").on("click", ".viewButton", function(e) {
      let i = view.getTodoElementIndex(e.target.parentNode.parentNode);
      $("[id=hidebuttons]")[i].style.display = "block";
      $("[class=viewButton]")[i].style.display = "none";
      $("[class=close-button]")[i].style.display = "block";
    });

    $("#todos").on("click", "#editButton", function(e) {
      let i = view.getTodoElementIndex(
        e.target.parentNode.parentNode.parentNode
      );
      var data = $("[class=edit]")[i];
      $(data)
        .attr("contenteditable", "true")
        .focus();
      return false;
    });

    todoMenu1.addEventListener("click", function(event) {
      var elementClicked = event.target;
      if (elementClicked.id === "toggleAll") {
        handlers.toggleAll();
      }
    });

    // Run addTodo function when 'Enter' is pressed inside addTodoTextInput
    addTodoTextInput.addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("hiding").style.display = "none";
      document.getElementById("toadd").style.display = "";
      document.getElementById("formhide").style.display = "none";
      var inputTitle = document.getElementById("title").value,
        inputUser = document.getElementById("user").value,
        inputDescr = document.getElementById("description").value;

      if (inputTitle === "" || inputUser === "" || inputDescr === "") {
        alert("Please write a task");
        return;
      } else {
        todo.push(inputTitle.trim().toLowerCase());
      }

      handlers.new();
    });

    todosUl.addEventListener("click", function(event) {
      // Get the element that was clicked.
      var elementClicked = event.target;

      // Check if elementClicked is a delete button.
      if (elementClicked.classList.contains("delete-button")) {
        // Get index using getTodoElementIndex function.
        var indexOfTodoElement = view.getTodoElementIndex(
          elementClicked.parentNode
        );
        todo.splice(indexOfTodoElement, 1);
        handlers.deleteTodo(indexOfTodoElement);
      }

      // Check if elementClicked is a checkbox.
      else if (elementClicked.classList.contains("checkbox")) {
        // Get index using getTodoElementIndex function.
        let index = view.getTodoElementIndex(
          elementClicked.parentNode.parentNode
        );

        handlers.toggleCompleted(todoList.todos[index]);
      }
    });
    // Make todos lose focus on Enter.
    todosUl.addEventListener("keypress", function(event) {
      var elementClicked = event.target;
      if (event.key === "Enter") {
        elementClicked.blur();
      }
    });
    todosUl.addEventListener("paste", function(event) {
      // Prevent paste.
      event.preventDefault();
      // Get text from clipboard.
      var text = event.clipboardData.getData("text/plain");
      // Insert text.
      document.execCommand("insertHTML", false, text);
    });
    todoMenu2.addEventListener("click", function(event) {
      var elementClicked = event.target;
      if (elementClicked.id === "deleteCompletedButton") {
        handlers.deleteCompletedTodos();
      }
      // If the clicked element is a menu 2 button, add 'active' class to it and remove it from any other active button.
      else if (elementClicked.classList.contains("menu-2-button")) {
        var menu2ButtonElements = document.querySelectorAll(".menu-2-button");
        menu2ButtonElements.forEach(function(button) {
          button.classList.remove("active");
        });
        elementClicked.classList.add("active");
        view.selectedFilter = elementClicked.id;
        view.displayTodos();
      }
    });
  }
};

view.setUpEventListeners();
todoList.getLocalStorage();
view.displayTodos();
