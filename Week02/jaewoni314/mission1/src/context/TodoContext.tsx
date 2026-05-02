import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';

interface TodoContextType {
  todos: string[];
  dones: string[];
  addTodo: (text: string) => void;
  completeTodo: (text: string) => void;
  deleteTodo: (text: string) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [dones, setDones] = useState<string[]>([]);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const savedDones = JSON.parse(localStorage.getItem('dones') || '[]');
    setTodos(savedTodos);
    setDones(savedDones);
  }, []);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodos = [...todos, text];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const completeTodo = (text: string) => {
    const newTodos = todos.filter((todo) => todo !== text);
    const newDones = [...dones, text];
    setTodos(newTodos);
    setDones(newDones);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    localStorage.setItem('dones', JSON.stringify(newDones));
  };

  const deleteTodo = (text: string) => {
    const newDones = dones.filter((done) => done !== text);
    setDones(newDones);
    localStorage.setItem('dones', JSON.stringify(newDones));
  };

  const value = { todos, dones, addTodo, completeTodo, deleteTodo };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// ✅ 추가된 부분
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 TodoProvider 안에서만 쓸 수 있음');
  }
  return context;
};
