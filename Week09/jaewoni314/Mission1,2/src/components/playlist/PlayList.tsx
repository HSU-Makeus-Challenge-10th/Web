import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { totalAmounts } from '../../store/cartSlice';
import type { RootState, AppDispatch } from '../../store/store';
import MusicCard from './MusicCard';

const PlayList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(totalAmounts());
  }, [cartItems, dispatch]);

  return (
    <>
      {cartItems.length === 0 ? (
        <section className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800">장바구니가 비어있습니다</h2>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            {cartItems.map((item) => (
              <MusicCard
                key={item.id}
                id={item.id}
                title={item.title}
                singer={item.singer}
                price={item.price}
                img={item.img}
                amount={item.amount}
              />
            ))}
          </section>
        </>
      )}
    </>
  );
};

export default PlayList;
