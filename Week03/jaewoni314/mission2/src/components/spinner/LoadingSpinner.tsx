import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader color="#10b981" size={500} />
    </div>
  );
};

export default LoadingSpinner;
