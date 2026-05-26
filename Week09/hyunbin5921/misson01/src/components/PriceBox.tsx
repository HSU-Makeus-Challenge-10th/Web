import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleInitiallize = () => {
    dispatch(clearCart());
  };

  return (
    <div className="flex justify-between items-center px-20 py-10">
      <div className="">
        <button
          onClick={handleInitiallize}
          className="border p-4 rounded-md cursor-pointer"
        >
          전체 삭제
        </button>
      </div>
      <div className="">총 가격 : {total} 원</div>
    </div>
  );
};

export default PriceBox;
