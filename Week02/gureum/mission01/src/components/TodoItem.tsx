import { useTodos, type Todo } from '../context/TodoContext';

interface Props {
  todo: Todo;
  classification: 'todo' | 'done';
}

export default function TodoItem({ todo, classification }: Props) {
  const { completeTodo, deleteDone } = useTodos();

  return (
    <li>
      <span>{todo.text}</span>
      {classification === 'todo' ? (
        <button className="complete" onClick={() => completeTodo(todo.id)}>완료</button>
      ) : (
        <button className="delete" onClick={() => deleteDone(todo.id)}>삭제</button>
      )}
    </li>
  );
}
