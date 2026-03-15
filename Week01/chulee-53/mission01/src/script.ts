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

const renderTasks = (): void => {
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

const getTodoText = (): string => {
  return todoInput.value.trim();
};

const addTodo = (text: string) => {
  // id 겹치지 않게 일단 Date로 설정
  todos.push({ id: Date.now(), text });
  todoInput.value = "";
  renderTasks();
};

const completeTodo = (todo: Todo) => {
  // 내가 클릭한 t.id와 다른 모든 목록을 filter로 랜더링해서 보여줌
  todos = todos.filter((t) => t.id !== todo.id);

  // 완료 목록에 push
  doneTasks.push(todo);
  renderTasks();
};

const deleteTodo = (todo: Todo) => {
  doneTasks = doneTasks.filter((t) => t.id !== todo.id);
  renderTasks();
};

const createTodoElement = (todo: Todo, isDone: boolean) => {
  const li = document.createElement("li");
  li.classList.add("render-container__item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("render-container__item-button");

  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }

  button.addEventListener("click", () => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

todoForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  const text = getTodoText();
  if (text) {
    addTodo(text);
  }
});

renderTasks();
