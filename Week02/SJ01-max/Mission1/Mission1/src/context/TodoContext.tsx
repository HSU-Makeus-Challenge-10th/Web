import { useMemo, useRef, useState, type ReactNode } from 'react';
import type { TodoItem } from '../types/todo';
import { TodoContext } from './TodoContextValue';

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([{ id: 1, text: '고구마', isDone: false }]);
  const nextIdRef = useRef(2);

  const addTodo = (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    setTodos((prev) => [
      ...prev,
      { id: nextIdRef.current++, text: trimmed, isDone: false },
    ]);
  };

  const completeTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isDone: true } : todo)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      completeTodo,
      deleteTodo,
    }),
    [todos],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
