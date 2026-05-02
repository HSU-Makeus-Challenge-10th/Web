import { TodoProvider } from './contexts/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTheme, ThemeProvider } from './contexts/ThemeContext';

// 1. 버튼 컴포넌트 (useTheme 사용)
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {theme === 'light' ? '🌙 다크모드로 보기' : '☀️ 라이트모드로 보기'}
    </button>
  );
};

// 2. 실제 내용을 담은 컴포넌트 (ThemeProvider의 자식으로 들어갈 부분)
const AppContent = () => {
  return (
    <div className="todo-app">
      <ThemeToggleButton />
      <h1 className="todo-app__title">My Todo List</h1>
      <TodoInput />
      <div className="todo-app__container">
        <TodoList title="해야 할 일" isDoneList={false} />
        <TodoList title="해낸 일" isDoneList={true} />
      </div>
    </div>
  );
};

// 3. 최상위 App 컴포넌트 (Provider만 씌워줌)
function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;