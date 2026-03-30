import { useMemo } from 'react';
import { useTodoContext } from '../context/useTodoContext';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const Todo = () => {
  const { todos, completeTodo, deleteTodo } = useTodoContext();
  const pendingTodos = useMemo(() => todos.filter((todo) => !todo.isDone), [todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.isDone), [todos]);

  return (
    <div className='todo-container'>
      <h1 className='todo-container__header'>YONG TODO</h1>
      <TodoForm />
      <div className='render-container'>
        <TodoList
          title='할 일'
          items={pendingTodos}
          buttonText='완료'
          buttonVariant='complete'
          onItemClick={completeTodo}
        />
        <TodoList
          title='완료'
          items={completedTodos}
          buttonText='삭제'
          buttonVariant='delete'
          onItemClick={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;