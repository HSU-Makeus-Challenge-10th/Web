import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';

type Props = {
  classification: 'todo' | 'done';
};

export default function TodoList({ classification }: Props) {
  const { todos, dones } = useTodos();
  const list = classification === 'todo' ? todos : dones;

  return (
    <ul className="space-y-2 min-h-8">
      {list.length === 0 && (
        <li className="text-center text-gray-400 dark:text-gray-500 text-sm py-2">
          {classification === 'todo' ? '비어 있어요' : '아직 없어요'}
        </li>
      )}
      {list.map((t) => (
        <TodoItem key={t.id} todo={t} classification={classification} />
      ))}
    </ul>
  );
}
