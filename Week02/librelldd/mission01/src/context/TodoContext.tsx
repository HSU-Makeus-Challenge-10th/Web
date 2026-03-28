import { createContext, useState,type PropsWithChildren, useContext } from 'react';
import type { TTodo } from '../types/todo';

// 1. 인터페이스 정의
interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    completeTodo: (todo: TTodo) => void;
    addTodo: (text: string) => void;
    deleteTodo: (todo: TTodo) => void;
}

// 2. 컨텍스트 생성
export const TodoContext = createContext<ITodoContext | undefined>(undefined);

// 3. 프로바이더 컴포넌트
export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const newTodo: TTodo = { id: Date.now(), text };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodo) =>
            prevDoneTodo.filter((t) => t.id !== todo.id)
        );
    };

    // 💡 return은 반드시 모든 함수 선언이 끝난 뒤에 와야 합니다!
    return (
        <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

// 4. 커스텀 훅 (에러의 핵심 지점!)
export const useTodo = () => {
    const context = useContext(TodoContext);
    
    if (!context) {
        throw new Error('useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야합니다.');
    }
    
    // 💡 여기서 데이터를 return 해줘야 Todo.tsx에서 todos를 읽을 수 있어요.
    return context; 
};