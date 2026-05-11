import Button from '../button/Button';

interface OrderSelectorProps {
  order?: 'asc' | 'desc';
  onOrderChange: (order: 'asc' | 'desc') => void;
}

const OrderSelector = ({
  order = 'desc',
  onOrderChange,
}: OrderSelectorProps) => {
  return (
    <div className="flex justify-end gap-[0.8vw] mb-[2vh]">
      <Button
        variant={order === 'desc' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onOrderChange('desc')}
      >
        최신순
      </Button>
      <Button
        variant={order === 'asc' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onOrderChange('asc')}
      >
        오래된순
      </Button>
    </div>
  );
};

export default OrderSelector;
