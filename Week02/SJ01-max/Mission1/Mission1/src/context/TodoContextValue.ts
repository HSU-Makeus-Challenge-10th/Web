import { createContext } from 'react';
import type { TodoItem } from '../types/todo';

export interface TodoContextValue {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export const TodoContext = createContext<TodoContextValue | null>(null);
