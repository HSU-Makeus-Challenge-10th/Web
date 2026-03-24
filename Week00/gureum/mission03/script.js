const input = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.isComposing) addTodo();
});

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;
  const btn = document.createElement('button');
  btn.textContent = '완료';
  btn.className = 'done-btn';
  btn.addEventListener('click', () => completeTask(li, text));
  li.appendChild(span);
  li.appendChild(btn);
  todoList.appendChild(li);
  input.value = '';
}

function completeTask(li, text) {
  li.remove();
  const doneItem = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;
  const btn = document.createElement('button');
  btn.textContent = '삭제';
  btn.className = 'delete-btn';
  btn.addEventListener('click', () => doneItem.remove());
  doneItem.appendChild(span);
  doneItem.appendChild(btn);
  doneList.appendChild(doneItem);
}