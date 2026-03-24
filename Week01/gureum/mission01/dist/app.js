"use strict";
const input = document.querySelector('.input-section input');
const todoList = document.querySelector('.todo');
const doneList = document.querySelector('.done');
const addButton = document.querySelector('.add-button');
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});
addButton.addEventListener('click', addTodo);
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const dones = JSON.parse(localStorage.getItem('dones') || '[]');
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${todo}</span> <button class="complete">완료</button>`;
        li.querySelector('.complete').addEventListener('click', () => completeTodo(todo));
        todoList.appendChild(li);
    });
    dones.forEach((todo) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="done">${todo}</span> <button class="delete">삭제</button>`;
        li.querySelector('.delete').addEventListener('click', () => {
            const newDones = dones.filter((done) => done !== todo);
            localStorage.setItem('dones', JSON.stringify(newDones));
            loadTodos();
        });
        doneList.appendChild(li);
    });
}
function addTodo() {
    const text = input.value.trim();
    if (!text)
        return;
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push(text);
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    loadTodos();
}
function completeTodo(text) {
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos = todos.filter((todo) => todo !== text);
    localStorage.setItem('todos', JSON.stringify(todos));
    const dones = JSON.parse(localStorage.getItem('dones') || '[]');
    dones.push(text);
    localStorage.setItem('dones', JSON.stringify(dones));
    loadTodos();
}
window.addEventListener('load', loadTodos);