import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Todo = { id: number; text: string };

type TodoContextValue = {
  todos: Todo[];
  dones: Todo[];
  addTodo: (text: string) => void;
  completeTodo: (id: number) => void;
  deleteDone: (id: number) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dones, setDones] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value }]);
  };

  const completeTodo = (id: number) => {
    // 대상 항목을 먼저 현재 상태에서 찾고
    const target = todos.find((x) => x.id === id);
    if (!target) return;
    // 목록에서 제거 (업데이터는 순수하게 유지)
    setTodos((prev) => prev.filter((x) => x.id !== id));
    // 완료 목록에 추가 (업데이터 밖에서 처리하여 중복 방지)
    setDones((prev) => [...prev, target]);
  };

  const deleteDone = (id: number) => {
    setDones((prev) => prev.filter((x) => x.id !== id));
  };

  const value = useMemo(
    () => ({ todos, dones, addTodo, completeTodo, deleteDone }),
    [todos, dones]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
