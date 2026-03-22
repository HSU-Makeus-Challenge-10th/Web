const inputField = document.getElementById(
  "todo-input-field",
) as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

//데이터
interface TodoItem {
  id: number;
  text: string;
  isDone: boolean;
}

//데이터 관리
let todos: TodoItem[] = JSON.parse(localStorage.getItem("todos") || "[]");

//로컬 스토리지 저장
function saveTodos(): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createItem(todo: TodoItem): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = todo.id.toString();

  const span = document.createElement("span");
  span.className = "item__text";
  span.textContent = todo.text;

  const button = document.createElement("button");
  // 초기 상태 따른 버튼 스타일
  button.className = todo.isDone ? "btn btn--delete" : "btn btn--done";
  button.textContent = todo.isDone ? "삭제" : "완료";

  button.addEventListener("click", (): void => {
    if (!li.parentElement) return;

    const currentId = Number(li.dataset.id);

    if (li.parentElement.id === "todo-list") {
      //완료
      const target = todos.find((t) => t.id === currentId);
      if (target) target.isDone = true;

      button.textContent = "삭제";
      button.className = "btn btn--delete";
      doneList.appendChild(li);
    } else {
      // 삭제
      todos = todos.filter((t) => t.id !== currentId);
      li.remove();
    }
    saveTodos(); // 변경 사항 저장
  });

  li.appendChild(span);
  li.appendChild(button);
  return li;
}

// 초기 화면 렌더링 (저장된 데이터 불러오기)
function render(): void {
  // 기존 리스트 비우기 (중복 방지)
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo) => {
    const item = createItem(todo);
    if (todo.isDone) {
      doneList.appendChild(item);
    } else {
      todoList.appendChild(item);
    }
  });
}

//할 일 추가
inputField.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.isComposing || e.key !== "Enter") return;

  const value = inputField.value.trim();
  if (value !== "") {
    const newTodo: TodoItem = {
      id: Date.now(),
      text: value,
      isDone: false,
    };

    todos.push(newTodo); // 배열에 추가
    saveTodos(); // 저장

    const newItem = createItem(newTodo);
    todoList.appendChild(newItem);
    inputField.value = "";
  }
});

// 앱 시작 시 실행
render();
