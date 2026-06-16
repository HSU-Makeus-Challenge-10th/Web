import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

function UseCallbackPage() {
  console.log("UseCallbackPage 렌더링");

  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // useCallback으로 감싸서 매 렌더링마다 새 함수가 생성되지 않게 함
  const handleCountClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  // useCallback 없이 넘김 -> 매 렌더링마다 새 함수가 생성되어 TextInput이 리렌더링됨 (비교용)
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h1>useCallback + React.memo 실습</h1>

      <section>
        <CountButton count={count} onClick={handleCountClick} />
        <p>현재 count: {count}</p>
      </section>

      <section>
        <TextInput text={text} onChange={handleTextChange} />
        <p>현재 text: {text}</p>
      </section>
    </div>
  );
}

export default UseCallbackPage;
