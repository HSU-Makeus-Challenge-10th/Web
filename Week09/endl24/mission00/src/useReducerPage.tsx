import { useReducer, useState } from "react";

interface IState {
  counter: number;
}
interface IAction {
  type: "INCREASE" | "DECREASE" | "RESET_TO_ZERO";
  payload?: number;
}

function reducer(state: IState, action: IAction) {
  const { type, payload } = action;

  switch (type) {
    case "INCREASE": {
      return {
        ...state,
        counter: state.counter + (payload ?? 0),
      };
    }
    case "DECREASE": {
      return {
        ...state,
        counter: state.counter - 1,
      };
    }
    case "RESET_TO_ZERO": {
      return {
        ...state,
        counter: 0,
      };
    }
    default:
      return state;
  }
}

export default function useReducerPage() {
  const [count, setCount] = useState(0);

  const [state, disPatch] = useReducer(reducer, {
    counter: 0,
  });
  const handleIncrease = () => {
    setCount(count + 1);
  };
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text=3xl">useState</h2>
        <h2>useState 훅 사용: {count}</h2>
        <button onClick={handleIncrease}>Increase</button>
      </div>
      <div>
        <h2 className="text=3xl">useReducer</h2>
        <h2>useReducer 훅 사용: {state.counter}</h2>
        <button
          onClick={() =>
            disPatch({
              type: "INCREASE",
              payload : 3,
            })
          }
        >
          Increase
        </button>
        <button
          onClick={() =>
            disPatch({
              type: "DECREASE",
            })
          }
        >
          Decrease
        </button>
        <button
          onClick={() =>
            disPatch({
              type: "RESET_TO_ZERO",
            })
          }
        >
          reset
        </button>
      </div>
    </div>
  );
}
