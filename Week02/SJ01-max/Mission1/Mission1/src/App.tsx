import './App.css';
import Todo from './components/Todo';
import { TodoProvider } from './context/TodoContext';

const App = () => {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
};

export default App;