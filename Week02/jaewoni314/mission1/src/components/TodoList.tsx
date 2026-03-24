import React from 'react';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

interface TodoListProps {
  classification: 'todo' | 'done';
}

const TodoList: React.FC<TodoListProps> = ({ classification }) => {
  const { todos, dones } = useTodo(); // useTodo 훅을 사용하여 todos와 dones 상태를 가져옴

  const items = classification === 'todo' ? todos : dones;

  return (
    <ul className={classification}>
      {items.map((item: string, index: number) => (
        <TodoItem
          key={`${classification}-${index}`}
          text={item}
          classification={classification}
        />
      ))}
    </ul>
  );
};

export default TodoList;
