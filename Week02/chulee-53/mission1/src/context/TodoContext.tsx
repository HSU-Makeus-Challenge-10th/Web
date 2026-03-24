import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
    addTodo: (text: string) => void;
}

let nextId = 1;

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: TTodo = {
            id: nextId,
            text,
        };
        setTodos((prev) => [...prev, newTodo]);
        nextId++;
    };

    const completeTodo = (todo: TTodo) => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setDoneTodos(prev => [...prev, todo]);
    }

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos(prev => prev.filter(t => t.id !== todo.id));
    }

    return (
        <TodoContext.Provider value={{ todos, doneTodos, completeTodo, deleteTodo, addTodo }}>
            {children}
        </TodoContext.Provider>
    )
}

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within TodoProvider');
    }
    return context; 
}