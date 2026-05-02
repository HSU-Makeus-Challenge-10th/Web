import TodoBefore from './TodoBefore';
import type { TodoItem } from '../types/todo';

interface TodoListProps {
  title: string;
  items: TodoItem[];
  buttonText: string;
  buttonVariant?: 'complete' | 'delete';
  onItemClick: (id: number) => void;
}

const TodoList = ({
  title,
  items,
  buttonText,
  buttonVariant = 'complete',
  onItemClick,
}: TodoListProps) => {
  return (
    <div className='render-container__section'>
      <h2 className='render-container__title'>{title}</h2>
      <ul className='render-container__list'>
        {items.length === 0 ? (
          <li className='render-container__item'>
            <span className='render-container__item-text'>아직 항목이 없습니다.</span>
          </li>
        ) : (
          items.map((item) => (
            <TodoBefore
              key={item.id}
              todo={item}
              buttonText={buttonText}
              buttonVariant={buttonVariant}
              onClick={() => onItemClick(item.id)}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
