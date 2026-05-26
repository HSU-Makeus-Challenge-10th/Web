import { useSelector } from '../hooks/useCustomRedux';

export const TotalPrice = () => {
  const { total } = useSelector((state) => state.cart);

  return (
    <div className='p-12 flex justify-between items-center'>
    </div>
  ); 
};

export default TotalPrice;