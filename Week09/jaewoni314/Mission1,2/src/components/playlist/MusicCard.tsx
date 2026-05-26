import { useDispatch } from 'react-redux';
import { Minus, Plus } from 'lucide-react';
import { increase, decrease } from '../../store/cartSlice';
import type { AppDispatch } from '../../store/store';

interface MusicCardProps {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

const MusicCard = ({ id, title, singer, price, img, amount }: MusicCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <article className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-6">
      <img
        src={img}
        alt={title}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{singer}</p>
        <p className="text-lg font-semibold mt-1">₩{parseInt(price).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(decrease(id))}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors cursor-pointer"
          
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold w-12 text-center">{amount}</span>
        <button
          onClick={() => dispatch(increase(id))}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors cursor-pointer"
          
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
};

export default MusicCard;
