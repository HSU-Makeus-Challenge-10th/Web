import type { TodoItem } from '../types/todo';

interface TodoBeforeProps {
  todo: TodoItem;
  buttonText: string;
  buttonVariant?: 'complete' | 'delete';
  onClick?: () => void;
}

const TodoBefore = ({ todo, buttonText, buttonVariant = 'complete', onClick }: TodoBeforeProps) => {
  const buttonColor = buttonVariant === 'delete' ? '#dc3545' : '#28a745';

  return (
    <li className='render-container__item'>
      <span className='render-container__item-text'>{todo.text}</span>
      <button
        type='button'
        onClick={onClick}
        className='render-container__item-button'
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </li>
  );
};

export default TodoBefore;
