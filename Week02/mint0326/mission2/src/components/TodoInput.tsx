import { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';

const TodoInput = () => {
    const [inputValue, setInputValue] = useState("");
    const { addTodo } = useTodo();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || inputValue.trim() === "") return;
        addTodo(inputValue);
        setInputValue(""); // 위치 수정
    };

    return (
        <input
            type="text"
            className="todo-app__input-field"
            placeholder="할 일을 입력하고 Enter를 누르세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
};

export default TodoInput; // 함수 밖으로 이동