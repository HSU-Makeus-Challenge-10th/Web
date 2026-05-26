import { useDispatch, useSelector } from '../hooks/useCustomRedux';
// ↙️ 현재 구조에 맞게 상위 폴더로 이동 후 modal 폴더를 바라보게 수정합니다.
import { openModal } from '../modal/modalSlice'; 

export const TotalPrice = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className='p-12 flex justify-between items-center'>
      <button 
        onClick={() => dispatch(openModal())} 
        className='border p-4 rounded-md cursor-pointer hover:bg-gray-50 font-medium'
      >
        장바구니 초기화
      </button>

      <div className='text-2xl font-bold text-gray-800'>
        총 가격: <span className='text-blue-600'>{total.toLocaleString()}</span>원
      </div>
    </div>
  ); 
};

export default TotalPrice;