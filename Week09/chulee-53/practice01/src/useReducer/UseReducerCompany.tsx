import { useReducer, useState, type ChangeEvent } from "react";

type TActionType = "CHANGE_DEPARTMENT" | "RESET";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: TActionType;
  payload?: string;
}

function reducer(state: IState, action: IAction): IState {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_DEPARTMENT": {
      const newDepartment = payload ?? state.department;
      const hasError = newDepartment?.trim() !== "카드메이커";
      return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError ? "거부권 행사 가능" : null,
      };
    }
    case "RESET":
      return { ...state, department: "Software Engineering", error: null };
    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, {
    department: "Software Engineering",
    error: null,
  });

  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const changeDepartment = () => {
    if (department.trim() !== "카드메이커") {
      setError("거부권 행사 가능");
    } else {
      setDepartment(department);
      setError(null);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
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
      <button
        onClick={() =>
          dispatch({ type: "CHANGE_DEPARTMENT", payload: department })
        }
      >
        Change Department
      </button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
