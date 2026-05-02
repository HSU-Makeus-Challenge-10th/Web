import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";

let nextId = 1;

const TodoBefore = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = {
                id: nextId,
                text,
            };
            setTodos((prev) => [...prev, newTodo]);
            setInput('');
            nextId++;
        }
    };

    const completeTodo = (todo: TTodo) => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setDoneTodos(prev => [...prev, todo]);
    }

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos(prev => prev.filter(t => t.id !== todo.id));
    }
    return (
        <div className="todo-container">
            <h1 className="todo-container__header">CHUL TODO</h1>
            <form onSubmit={handleSubmit} className="todo-container__form">
                <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="todo-container__input" placeholder="할 일을 입력하세요" required />
                <button type="submit" className="todo-container__button">할 일 추가</button>
            </form>
            <div className="render-container">
                <section className="render-container__section">
                    <h2 className="render-container__title">할 일</h2>
                    <ul className="render-container__list">
                        {todos.map((todo) => (
                            <li key={todo.id} className="render-container__item">
                                <span className="render-container__item-text">{todo.text}</span>
                                <button onClick={() => completeTodo(todo)} style={{ backgroundColor: "#28a745" }} className="render-container__item-button">완료</button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="render-container__section">
                    <h2 className="render-container__title">완료</h2>
                    <ul className="render-container__list">
                        {doneTodos.map((todo) => (
                            <li key={todo.id} className="render-container__item">
                                <span className="render-container__item-text">{todo.text}</span>
                                <button onClick={() => deleteTodo(todo)} style={{ backgroundColor: "#dc3545" }} className="render-container__item-button">삭제</button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default TodoBefore