import { useReducer, useState, type ChangeEvent } from "react";

const INITIAL_DEPARTMENT = "Software Developer";
const ALLOWED_DEPARTMENT = "카드메이커";
const ERROR_MESSAGE = "거부권 행사기능, 카드메이커만 입력 가능합니다.";

interface IState {
  department: string;
  error: string | null;
}

type IAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string };

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

  return (
    <main className="company-page">
      <section className="company-panel" aria-labelledby="department-title">
        <h1 id="department-title">{state.department}</h1>
        <p className={`error-message ${state.error ? "visible" : ""}`}>
          {state.error}
        </p>

        <div className="form-row">
          <input
            type="text"
            value={department}
            onChange={handleChange}
            placeholder="카드메이커"
            className="department-input"
          />
          <button type="button" onClick={handleSubmit} className="change-button">
            직무 변경하기
          </button>
        </div>
      </section>
    </main>
  );
}
