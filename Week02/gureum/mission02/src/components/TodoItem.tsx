import { useTodos, type Todo } from '../context/TodoContext';

interface Props {
  todo: Todo;
  classification: 'todo' | 'done';
}

export default function TodoItem({ todo, classification }: Props) {
  const { completeTodo, deleteDone } = useTodos();

  return (
    <li className="flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
      <span className="text-gray-800 dark:text-gray-200 text-sm truncate mr-2">
        {todo.text}
      </span>
      {classification === 'todo' ? (
        <button
          onClick={() => completeTodo(todo.id)}
          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md whitespace-nowrap transition-colors duration-300 cursor-pointer"
        >
          완료
        </button>
      ) : (
        <button
          onClick={() => deleteDone(todo.id)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md whitespace-nowrap transition-colors duration-300 cursor-pointer"
        >
          삭제
        </button>
      )}
    </li>
  );
}
