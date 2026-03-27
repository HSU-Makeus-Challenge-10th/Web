const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

// Enter 추가
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (text === "") return;

    addTodo(text);
    input.value = "";
  }
});

function addTodo(text) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const btnGroup = document.createElement("div");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "완료";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";

  btnGroup.appendChild(completeBtn);
  btnGroup.appendChild(deleteBtn);

  // 완료
  completeBtn.addEventListener("click", function () {
    completeTodo(li);
  });

  // 삭제
  deleteBtn.addEventListener("click", function () {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(btnGroup);

  todoList.appendChild(li);
}

function completeTodo(li) {
  li.classList.add("done");

  // 완료 버튼 제거
  li.querySelector("button").remove();

  doneList.appendChild(li);
}