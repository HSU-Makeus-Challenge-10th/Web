import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

// Context 사용을 위한 커스텀 훅
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};