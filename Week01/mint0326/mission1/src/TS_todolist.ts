const inputField = document.getElementById(
  "todo-input-field",
) as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

interface TodoItem {
  id: number;
  text: string;
  isDone: boolean; // 완료 여부
}

function createItem(todo: TodoItem): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = todo.id.toString();

  const span = document.createElement("span");
  span.className = "item__text";
  span.textContent = todo.text;

  const button = document.createElement("button");
  button.className = todo.isDone ? "btn btn--delete" : "btn btn--done";
  button.textContent = todo.isDone ? "삭제" : "완료";

  button.addEventListener("click", (): void => {
    if (!li.parentElement) return;

    if (li.parentElement.id === "todo-list") {
      button.textContent = "삭제";
      button.className = "btn btn--delete";
      doneList.appendChild(li);
    } else {
      li.remove();
    }
  });

  li.appendChild(span);
  li.appendChild(button);
  return li;
}

inputField.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.isComposing || e.key !== "Enter") {
    return;
  }
  const value = inputField.value.trim();

  if (value !== "") {
    const newTodo: TodoItem = {
      id: Date.now(),
      text: value,
      isDone: false,
    };

    const newItem = createItem(newTodo);
    todoList.appendChild(newItem);
    inputField.value = "";
  }
});
