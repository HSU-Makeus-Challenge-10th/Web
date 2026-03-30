import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

// Context 사용을 위한 커스텀 훅
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 TodoProvider 안에서만 쓸 수 있음');
  }
  return context;
};
