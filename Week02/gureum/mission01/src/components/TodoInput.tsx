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
    <section className="input-section">
      <label htmlFor="todo-input">할 일 입력</label>
      <input
        id="todo-input"
        aria-label="할 일 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder="스터디 계획을 작성해보세요!"
      />
      <button className="add-button" onClick={onAdd}>할 일 추가</button>
    </section>
  );
}
