interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          오류가 발생했습니다
        </h2>
        <h3 className="text-red-500">{message}</h3>
      </div>
    </div>
  );
};

export default Error;
