import { useReducer, useState, type ChangeEvent } from 'react';

type ActionType = 'CHANGE_DEPT' | 'RESET';

interface State {
  department: string;
  error: string | null;
}

interface Action {
  type: ActionType;
  payload?: string;
}

const initialState: State = {
  department: 'SW Developer',
  error: null,
};

function reducer(state: State, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_DEPT': {
      const newDept = payload ?? '';
      const hasError = newDept !== '카드메이커';

      return {
        ...state,
        department: hasError ? state.department : newDept,
        error: hasError
          ? '거부권 행사 가능, 카드메이커만 입력 가능합니다.'
          : null,
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const ReducerCompany = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dept, setDept] = useState('');

  const handleChangeDept = (e: ChangeEvent<HTMLInputElement>) => {
    setDept(e.target.value);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col w-full justify-center items-center gap-3 px-4">
        <h1 className="text-4xl md:text-5xl text-center">{state.department}</h1>
        {state.error && <p className="text-lg text-red-500">{state.error}</p>}

        <div className="w-full flex justify-center items-center gap-3 max-w-3xl">
          <input
            placeholder="변경할 직무 입력 (카드메이커만 허용)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={dept}
            onChange={handleChangeDept}
          />
          <div className="flex gap-2 shrink-0">
            <button
              className="bg-blue-200 rounded-lg p-2 hover:bg-blue-400 cursor-pointer duration-300"
              onClick={() => dispatch({ type: 'CHANGE_DEPT', payload: dept })}
            >
              직무 변경
            </button>
            <button
              className="bg-gray-200 rounded-lg p-2 hover:bg-gray-400 cursor-pointer duration-300"
              onClick={() => dispatch({ type: 'RESET' })}
            >
              리셋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReducerCompany;
