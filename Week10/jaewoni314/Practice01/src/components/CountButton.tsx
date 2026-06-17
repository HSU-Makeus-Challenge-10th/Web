import { memo } from "react";

interface CountButtonProps {
  count: number;
  onClick: () => void;
}

function CountButton({ count, onClick }: CountButtonProps) {
  console.log("CountButton 렌더링");

  return (
    <button onClick={onClick}>count: {count}</button>
  );
}

export default memo(CountButton);
