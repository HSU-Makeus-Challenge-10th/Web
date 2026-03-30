import { TodoProvider } from './contexts/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <TodoProvider> {/* 전역 상태 공급 시작 */}
      <div className="todo-app">
        <h1 className="todo-app__title">My Todo List</h1>
        <TodoInput />
        <div className="todo-app__container">
          <TodoList title="해야 할 일" isDoneList={false} />
          <TodoList title="해낸 일" isDoneList={true} />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;