import { useState } from 'react';
import { TTodo } from './types/todo';
import './App.css';

const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);

  // 할 일 추가
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, isBoolean: false }]);
    setInputValue('');
  };

  // 완료로 이동
  const completeTask = (task: TTodo) => {
    setTodos((prev) => prev.filter((t) => t.id !== task.id));
    setDoneTasks((prev) => [...prev, task]);
  };

  // 완료 항목 삭제
  const deleteTask = (task: TTodo) => {
    setDoneTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <div className='todo-container'>
      <h1 className='todo-container__header'>YONG TODO</h1>
      <form className='todo-container__form' onSubmit={addTodo}>
        <input
          type='text'
          className='todo-container__input'
          placeholder='할 일 입력'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <button type='submit' className='todo-container__button'>
          할 일 추가
        </button>
      </form>
      <div className='render-container'>
        {/* 할 일 목록 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>할 일</h2>
          <ul id='todo-list' className='render-container__list'>
            {todos.map((task) => (
              <li key={task.id} className='render-container__item'>
                <span className='render-container__item-text'>{task.text}</span>
                <button
                  className='render-container__item-button'
                  style={{ backgroundColor: '#28a745' }}
                  onClick={() => completeTask(task)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 완료 목록 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>완료</h2>
          <ul id='done-list' className='render-container__list'>
            {doneTasks.map((task) => (
              <li key={task.id} className='render-container__item'>
                <span className='render-container__item-text'>{task.text}</span>
                <button
                  className='render-container__item-button'
                  style={{ backgroundColor: '#dc3545' }}
                  onClick={() => deleteTask(task)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;