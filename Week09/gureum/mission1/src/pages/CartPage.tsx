import CartList from '../components/CartList';

const CartPage = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">당신이 선택한 음반</h2>
      <CartList />
    </section>
  );
};

export default CartPage;
