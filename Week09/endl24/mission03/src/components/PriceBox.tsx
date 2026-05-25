import { useCartInfo } from "../hooks/useCartStore";
import { useModalActions } from "../hooks/useModalStore";

const PriceBox = () => {
  const { total } = useCartInfo();
  const {openModal} = useModalActions();
  return (
    <div className="p-12 flex justify-between">
      <button
        onClick={openModal}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 비우기
      </button>
      <div>총 가격 :{total} ₩</div>
    </div>
  );
};

export default PriceBox;
