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
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = todo;
    const btn = document.createElement('button');
    btn.textContent = '완료';
    btn.className = 'complete';
    btn.addEventListener('click', () => completeTodo(index));
    li.appendChild(span);
    li.appendChild(btn);
    todoList.appendChild(li);
  });

  // 해낸 일 렌더링
  dones.forEach((done, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = done;
    span.className = 'done';
    const btn = document.createElement('button');
    btn.textContent = '삭제';
    btn.className = 'delete';
    btn.addEventListener('click', () => {
      const newDones = [...dones];
      newDones.splice(index, 1);
      localStorage.setItem('dones', JSON.stringify(newDones));
      loadTodos();
    });
    li.appendChild(span);
    li.appendChild(btn);
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
function completeTodo(index: number): void {
  const todos: string[] = JSON.parse(localStorage.getItem('todos') || '[]');
  const removed = todos.splice(index, 1);
  const text: string | undefined = removed[0];
  if (text === undefined) return;
  localStorage.setItem('todos', JSON.stringify(todos));

  const dones: string[] = JSON.parse(localStorage.getItem('dones') || '[]');
  dones.push(text);
  localStorage.setItem('dones', JSON.stringify(dones));

  loadTodos();
}

// 페이지 로드 시 초기화
window.addEventListener('load', loadTodos);