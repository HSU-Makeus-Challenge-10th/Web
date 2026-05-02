import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TodoItem } from '../types/todo';


// 1. 컨텍스트가 들고 있을 데이터의 타입 정의
interface TodoContextType {
    todos: TodoItem[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

// 2. 컨텍스트 생성
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// 3. 공급자(Provider) 컴포넌트 만들기
export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [todos, setTodos] = useState<TodoItem[]>(() => {
        const saved = localStorage.getItem("todos");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text: string) => {
        const newTodo: TodoItem = { id: Date.now(), text, isDone: false };
        setTodos([...todos, newTodo]);
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(t => t.id === id ? { ...t, isDone: true } : t));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

// 4. 컨텍스트를 쉽게 쓰기 위한 커스텀 훅
export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) throw new Error("useTodo must be used within a TodoProvider");
    return context;
};