import { useState, type FormEvent } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodo } from "../context/TodoContext";

const Todo = ()  => {
   
    const [input, setInput] = useState<string>('');
    const{ todos, completeTodo, addTodo, deleteTodo, doneTodos} = useTodo();
    
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>)
    :void => {
        e.preventDefault();
        const text = input.trim();
        if (text) {
                addTodo(text);
                setInput('');
            }
    
        };
    
        
    return(

    <div className='todo-container'>
        <h1 className='todo-container__header'>Todo List</h1>
        <TodoForm input={input} setInput={setInput}
        handleSubmit={handleSubmit} />

    <div className='render-container'>
        <TodoList 
        title='할 일'
        todos={todos} 
        buttonLabel='완료'
        buttonColor='#fa8ee1'
        onClick={completeTodo}
        />

        <TodoList 
        title='완료'
        todos={doneTodos}
        buttonLabel='삭제'
        buttonColor='#956ef1'
        onClick={deleteTodo}
         />
        
    </div>
    </div>
    );
};

export default Todo;