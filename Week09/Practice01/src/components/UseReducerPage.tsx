import { useReducer, useState } from "react";

interface IState {
  counter: number;
}

interface IAction {
  type: "INCREMENT" | "DECREMENT" | "RESET";
}

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    case "RESET":
      return { ...state, counter: 0 };
    default:
      return state;
  }
}

export default function UseReducerPage() {
  const [count, setCount] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
  });

  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <div className="counter-page">
      <div>
        <h1>useState훅 사용: {count}</h1>
        <button type="button" onClick={handleIncrease}>
          Increase
        </button>
      </div>
      <div>
        <h1>useReducer훅 사용: {state.counter}</h1>
        <button type="button" onClick={() => dispatch({ type: "INCREMENT" })}>
          Increase
        </button>
      </div>
    </div>
  );
}
