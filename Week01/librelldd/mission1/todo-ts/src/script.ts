// 1.HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;
//2. 할 일이 어떻게 생긴예인지 Type을 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo []= [];
let doneTasks: Todo []= [];

// 할일 목록 센더링 하는 향수를 정의
const renderTask = (): void => {
    todoList. innerHTML = '';
    doneList. innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        todoList.appendChild(li);
    });
};


//3. 할 일 텍스트 입력 처리 함수,
const getTodoText = (): string => {
return todoInput.value.trim();
};

//4 할 일 추가 처리 함수
const addTodo = (text: string) : void => {
    todos. push ({id: Date.now(), text });
    todoInput.value='';
    renderTask ();
};


// 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo) : void => {
    todos = todos.filter((t)) : bollean => todo.id !== todo.id);
    doneTasks.push(todo);
    renderTask();
};
//완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo) : void => {
    doneTasks = doneTasks.filter((t) : boolean => todo.id !==todo.id);
    renderTask();
};

//할 일 아이템 생성 함수
const createTodoElement = (todo: Todo, isDone: boolean): void => { 
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button=document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent='삭제';
        button.style.backgroundColor = '#dc3545';

} else {
    button.textContent = '완료';
    button.style.backgroundColor = '#28a745';
}

button.addEventListener('click',():void =>{
    if (isDone) {
        deleteTodo(todo);
    } else {  completeTodo(todo: Todo): void
        completeTodo(todo);

    }
} );

li.appendChild(button);
return li;

};
//<ul id="todo-list" class="render-container__list">
       // </ul>
   // </div>
     // <div class="render-container__section">
      //  <h2 class="render-container__title">완료</h2>
      //  <ul id="todo-list" class="render-container__list">
        //    <li class="render-container__item"></li>
            
        //</ul>
//이벤트리스너
todoForm.addEventListener('submit', (event: Event):void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTask();