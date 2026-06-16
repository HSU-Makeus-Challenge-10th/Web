import { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

function UseMemoPage() {
  console.log("UseMemoPage 렌더링");

  const [number, setNumber] = useState("");
  // 소수 계산과 무관한 state. 이 값만 바꿔도 컴포넌트는 리렌더링되지만
  // useMemo의 의존성(number)이 그대로면 소수 계산은 재실행되지 않아야 함
  const [note, setNote] = useState("");

  const max = Number(number) || 0;

  const primeNumbers = useMemo(() => {
    console.log("소수 계산 실행");
    return findPrimeNumbers(max).filter(
      (value): value is number => value !== null
    );
  }, [max]);

  return (
    <div>
      <h1>useMemo 실습 - 소수 리스트</h1>

      <section>
        <TextInput
          text={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <p>입력한 숫자: {max}</p>
      </section>

      <section>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="소수 계산과 무관한 입력 (재계산 안 됨 확인용)"
        />
      </section>

      <section>
        <p>{max} 이하의 소수 개수: {primeNumbers.length}</p>
        <p>{primeNumbers.join(", ")}</p>
      </section>
    </div>
  );
}

export default UseMemoPage;
