// src/App.tsx
import './App.css';
import { TodoProvider } from './context/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <TodoProvider>
      <main>
        <header>HYEON TODO</header>
        <TodoInput />
        <section className="container">
          <section>
            <h2>해야할 일</h2>
            <TodoList classification="todo" />
          </section>
          <section>
            <h2>해낸 일</h2>
            <TodoList classification="done" />
          </section>
        </section>
      </main>
    </TodoProvider>
  );
}
