"use strict";
const inputField = document.getElementById('todo-input-field');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
function createItem(todo) {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = todo.id.toString();
    const span = document.createElement('span');
    span.className = 'item__text';
    span.textContent = todo.text;
    const button = document.createElement('button');
    button.className = todo.isDone ? 'btn btn--delete' : 'btn btn--done';
    button.textContent = todo.isDone ? '삭제' : '완료';
    button.addEventListener('click', () => {
        if (!li.parentElement)
            return;
        if (li.parentElement.id === 'todo-list') {
            button.textContent = '삭제';
            button.className = 'btn btn--delete';
            doneList.appendChild(li);
        }
        else {
            li.remove();
        }
    });
    li.appendChild(span);
    li.appendChild(button);
    return li;
}
inputField.addEventListener('keypress', (e) => {
    const value = inputField.value.trim();
    if (e.key === 'Enter' && value !== "") {
        const newTodo = {
            id: Date.now(),
            text: value,
            isDone: false
        };
        const newItem = createItem(newTodo);
        todoList.appendChild(newItem);
        inputField.value = '';
    }
});
