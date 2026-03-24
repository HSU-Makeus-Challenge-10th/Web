import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState(''); // 입력창 상태 관리
  const { addTodo } = useTodo();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="input-section">
      <input
        type="text"
        placeholder="할 일 입력"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="add-button" onClick={handleSubmit}>
        할 일 추가
      </button>
    </section>
  );
};

export default TodoInput;
