import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';

interface TodoContextType {
  todos: string[];
  dones: string[];
  addTodo: (text: string) => void;
  completeTodo: (text: string) => void;
  deleteTodo: (text: string) => void;
}
// Context 생성
export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [dones, setDones] = useState<string[]>([]);

  // 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const savedDones = JSON.parse(localStorage.getItem('dones') || '[]');
    setTodos(savedTodos);
    setDones(savedDones);
  }, []);

  // 새로운 할 일 추가
  const addTodo = (text: string) => {
    if (!text.trim()) return;

    const newTodos = [...todos, text];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  // 할 일 완료 처리
  const completeTodo = (text: string) => {
    const newTodos = todos.filter((todo) => todo !== text);
    const newDones = [...dones, text];

    setTodos(newTodos);
    setDones(newDones);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    localStorage.setItem('dones', JSON.stringify(newDones));
  };

  // 완료된 일 삭제
  const deleteTodo = (text: string) => {
    const newDones = dones.filter((done) => done !== text);
    setDones(newDones);
    localStorage.setItem('dones', JSON.stringify(newDones));
  };

  const value = {
    todos,
    dones,
    addTodo,
    completeTodo,
    deleteTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 TodoProvider 안에서만 쓸 수 있음');
  }
  return context;
};