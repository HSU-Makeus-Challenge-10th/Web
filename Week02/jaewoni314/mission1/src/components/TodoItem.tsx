import React from 'react';
import { useTodo } from '../context/TodoContext';

interface TodoItemProps {
  text: string;
  classification: 'todo' | 'done';
}

const TodoItem: React.FC<TodoItemProps> = ({ text, classification }) => {
  const { completeTodo, deleteTodo } = useTodo();

  const handleComplete = () => {
    completeTodo(text);
  };

  const handleDelete = () => {
    deleteTodo(text);
  };

  return (
    <li>
      {classification === 'todo' ? (
        <>
          <span>{text}</span>
          <button className="complete" onClick={handleComplete}>
            완료
          </button>
        </>
      ) : (
        <>
          <span className="done">{text}</span>
          <button className="delete" onClick={handleDelete}>
            삭제
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
