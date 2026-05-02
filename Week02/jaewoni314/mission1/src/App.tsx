import './App.css';
import { TodoProvider } from './context/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <TodoProvider>
      <h1>WON TODO</h1>
      <TodoInput />
      <TodoList classification="todo" />
      <TodoList classification="done" />
    </TodoProvider>
  );
}

export default App;
