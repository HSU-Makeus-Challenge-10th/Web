import './index.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTheme } from './hooks/useTheme';
import { useEffect } from 'react';

export default function App() {
  const { isDark, toggle } = useTheme();

  //body 색 관리
  useEffect(() => {
    document.body.className = isDark ? 'dark-body' : 'light-body';
  }, [isDark]);

  return (
    <main
      className={
        isDark
          ? 'dark:bg-gray-700 dark:text-slate-100 dark:shadow-slate-900'
          : 'bg-white'
      }
    >
      <header className={isDark ? 'dark:text-slate-100' : ''}>
        <span>WON TODO</span>
      </header>
      <button
        onClick={toggle}
        className={`dark-button ${isDark ? 'text-gray-100' : 'text-gray-700'}`}
      >
        {isDark ? 'light' : 'dark'}
      </button>
      <TodoInput />
      <section className="todo-sections">
        <section>
          <h2>할 일</h2>
          <TodoList classification="todo" />
        </section>
        <section>
          <h2>완료</h2>
          <TodoList classification="done" />
        </section>
      </section>
    </main>
  );
}
