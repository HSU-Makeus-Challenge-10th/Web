import { useTodo } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

interface TodoListProps {
    title: string;
    isDoneList: boolean;
}

const TodoList = ({ title, isDoneList }: TodoListProps) => {
    const { todos } = useTodo(); // 컨텍스트에서 직접 데이터 추출
    const filteredTodos = todos.filter(t => t.isDone === isDoneList);

    return (
        <section className="section">
            <h2 className="section__title">{title}</h2>
            <ul className={`list ${isDoneList ? 'list--done' : ''}`}>
                {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
            </ul>
        </section>
    );
};

export default TodoList;