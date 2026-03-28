import { useState } from 'react';
import { useTodoContext } from '../context/useTodoContext';

const TodoForm = () => {
  const { addTodo } = useTodoContext();
  const [input, setInput] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(input);
    setInput('');
  };

  return (
    <form className='todo-container__form' onSubmit={handleSubmit}>
      <input
        type='text'
        className='todo-container__input'
        placeholder='할 일 입력'
        value={input}
        onChange={(event) => setInput(event.target.value)}
        required
      />
      <button type='submit' className='todo-container__button'>
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;
