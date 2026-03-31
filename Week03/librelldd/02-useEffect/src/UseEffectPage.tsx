import {useState} from 'react';

export const UseEffectPage = () => {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    setCount((prev): number => prev + 1);

  }
  return (
    <div> 
      <h3> UseEffectPage</h3>
      <h1>{count}</h1>
      <button onClick={handleIncrease}>증가</button>
       </div>
  )
}
