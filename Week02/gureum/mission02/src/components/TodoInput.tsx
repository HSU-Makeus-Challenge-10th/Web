import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

export default function TodoInput() {
  const { addTodo } = useTodos();
  const [value, setValue] = useState('');

  const onAdd = () => {
    const v = value.trim();
    if (!v) return;
    addTodo(v);
    setValue('');
  };

  const onKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) onAdd();
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder="스터디 계획을 작성해보세요!"
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
      />
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium whitespace-nowrap transition-colors duration-300 cursor-pointer"
      >
        할 일 추가
      </button>
    </div>
  );
}
