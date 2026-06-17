import { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

function UseMemoPage() {
  console.log("UseMemoPage 렌더링");

  const [number, setNumber] = useState("");
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
      <h1>useMemo</h1>

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
