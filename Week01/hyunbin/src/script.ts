const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

const renderTasks = () => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo) => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });

  doneTasks.forEach((todo) => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
};

const getTodoText = () => {
  return todoInput.value.trim();
};

const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
  };

  todos.push(newTodo);
  todoInput.value = "";
  renderTasks();
};

const completeTodo = (todo: Todo) => {
  todos = todos.filter((t) => t.id !== todo.id);
  doneTasks.push(todo);
  renderTasks();
};

const deleteTodo = (todo: Todo) => {
  doneTasks = doneTasks.filter((t) => t.id !== todo.id);
  renderTasks();
};

const createTodoElement = (todo: Todo, isDone: boolean) => {
  const li = document.createElement("li");
  li.classList.add("render-container_item");

  const text = document.createElement("p");
  text.classList.add("render-container_item-text");
  text.textContent = todo.text;

  const button = document.createElement("button");

  if (isDone) {
    button.textContent = "삭제";
    button.classList.add("render-container_item-button"); // 빨간 삭제 버튼
  } else {
    button.textContent = "완료";
    button.classList.add("complete-button"); // 초록 완료 버튼
  }

  button.addEventListener("click", () => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(text);
  li.appendChild(button);

  return li;
};

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = getTodoText();
  if (!text) return;

  addTodo(text);
});

renderTasks();