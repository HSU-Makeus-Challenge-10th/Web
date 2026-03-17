const input = document.querySelector(
  '.input-section input'
) as HTMLInputElement;
const todoList = document.querySelector('.todo') as HTMLUListElement;
const doneList = document.querySelector('.done') as HTMLUListElement;
const addButton = document.querySelector('.add-button') as HTMLButtonElement;

// 이벤트 리스너 등록
input.addEventListener('keypress', function (e: KeyboardEvent) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

addButton.addEventListener('click', addTodo);

// 할 일 목록 렌더링
function loadTodos(): void {
  const todos: string[] = JSON.parse(localStorage.getItem('todos') || '[]');
  const dones: string[] = JSON.parse(localStorage.getItem('dones') || '[]');

  todoList.innerHTML = '';
  doneList.innerHTML = '';

  // 해야할 일 렌더링
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${todo}</span> <button class="complete">완료</button>`;
    li.querySelector('.complete')!.addEventListener('click', () =>
      completeTodo(todo)
    );
    todoList.appendChild(li);
  });

  // 해낸 일 렌더링
  dones.forEach((todo) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="done">${todo}</span> <button class="delete">삭제</button>`;
    li.querySelector('.delete')!.addEventListener('click', () => {
      const newDones = dones.filter((done) => done !== todo);
      localStorage.setItem('dones', JSON.stringify(newDones));
      loadTodos();
    });
    doneList.appendChild(li);
  });
}

// 새로운 할 일 추가
function addTodo(): void {
  const text = input.value.trim();
  if (!text) return;

  const todos: string[] = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push(text);
  localStorage.setItem('todos', JSON.stringify(todos));

  input.value = '';
  loadTodos();
}

// 할 일 완료 처리
function completeTodo(text: string): void {
  let todos: string[] = JSON.parse(localStorage.getItem('todos') || '[]');
  todos = todos.filter((todo) => todo !== text);
  localStorage.setItem('todos', JSON.stringify(todos));

  const dones: string[] = JSON.parse(localStorage.getItem('dones') || '[]');
  dones.push(text);
  localStorage.setItem('dones', JSON.stringify(dones));

  loadTodos();
}

// 페이지 로드 시 초기화
window.addEventListener('load', loadTodos);