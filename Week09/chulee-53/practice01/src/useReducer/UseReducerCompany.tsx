import { useReducer, useState, type ChangeEvent } from "react";

const INITIAL_DEPARTMENT = "Software Engineering";
const ALLOWED_DEPARTMENT = "카드메이커";
const ERROR_MESSAGE = "카드메이커 부서만 선택할 수 있습니다.";

interface IState {
  department: string;
  error: string | null;
}

type IAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string }
  | { type: "RESET" };

const initialState: IState = {
  department: INITIAL_DEPARTMENT,
  error: null,
};

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "CHANGE_DEPARTMENT": {
      const nextDepartment = action.payload.trim();

      if (nextDepartment !== ALLOWED_DEPARTMENT) {
        return {
          ...state,
          error: ERROR_MESSAGE,
        };
      }

      return {
        department: nextDepartment,
        error: null,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [department, setDepartment] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDepartment(event.target.value);
  };

  const handleSubmit = () => {
    dispatch({ type: "CHANGE_DEPARTMENT", payload: department });
  };

  const handleReset = () => {
    setDepartment("");
    dispatch({ type: "RESET" });
  };

  return (
    <div>
      <h1>{state.department}</h1>
      {state.error && <p>{state.error}</p>}
      <input
        type="text"
        value={department}
        onChange={handleChange}
        className="border border-gray-300 rounded-md p-2"
      />
      <button onClick={handleSubmit}>Change Department</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
