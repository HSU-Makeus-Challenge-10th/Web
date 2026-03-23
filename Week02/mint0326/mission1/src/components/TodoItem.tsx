import type { TodoItem as TodoItemType } from '../types/todo.ts';
import { useTodo } from '../contexts/TodoContext'; // 추가

interface TodoItemProps {
    todo: TodoItemType;
    // onToggle, onDelete 삭제
}

const TodoItem = ({ todo }: TodoItemProps) => {
    const { toggleTodo, deleteTodo } = useTodo(); // 여기서 직접 꺼냄

    return (
        <li className="item">
            <span className="item__text">{todo.text}</span>
            {todo.isDone ? (
                <button className="btn btn--delete" onClick={() => deleteTodo(todo.id)}>
                    삭제
                </button>
            ) : (
                <button className="btn btn--done" onClick={() => toggleTodo(todo.id)}>
                    완료
                </button>
            )}
        </li>
    );
};

export default TodoItem;