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
  li.innerHTML = `<span>${text}</span> <button class="done-btn">완료</button>`;
  li.querySelector('button').addEventListener('click', () => completeTask(li, text));
  todoList.appendChild(li);
  input.value = '';
}

function completeTask(li, text) {
  li.remove();
  const doneItem = document.createElement('li');
  doneItem.innerHTML = `<span>${text}</span> <button class="delete-btn">삭제</button>`;
  doneItem.querySelector('button').addEventListener('click', () => doneItem.remove());
  doneList.appendChild(doneItem);
}