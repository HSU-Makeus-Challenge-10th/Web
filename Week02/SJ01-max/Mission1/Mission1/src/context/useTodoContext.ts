import { useContext } from 'react';
import { TodoContext } from './TodoContextValue';

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }

  return context;
};
