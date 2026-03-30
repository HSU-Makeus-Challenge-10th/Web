import { type FormEvent } from "react";

// 1. 설계도(Interface) 정의
interface TodoFormProps {
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

// 2. 컴포넌트 선언 (여기가 에러의 핵심이었어요!)
// ({ props들 } : 타입이름) => { ... } 이 형식을 지켜야 합니다.
const TodoForm = ({ input, setInput, handleSubmit }: TodoFormProps) => {
    return (
        <form className='todo-form' onSubmit={handleSubmit}>
            <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='할 일을 입력하세요'
                className='todo-form__input'
            />
            <button type='submit' className='todo-form__button'>
                추가
            </button>
        </form>
    );
};

export default TodoForm;