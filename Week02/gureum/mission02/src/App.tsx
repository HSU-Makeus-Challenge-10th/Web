import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';
import ThemeToggle from './components/ThemeToggle';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <Inner />
      </TodoProvider>
    </ThemeProvider>
  );
}

function Inner() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-lg transition-colors duration-300">
        <header className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HYEON TODO</h1>
          <ThemeToggle />
        </header>
        <TodoInput />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <section>
            <h2 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 mb-2">해야할 일</h2>
            <TodoList classification="todo" />
          </section>
          <section>
            <h2 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 mb-2">해낸 일</h2>
            <TodoList classification="done" />
          </section>
        </div>
      </main>
    </div>
  );
}

