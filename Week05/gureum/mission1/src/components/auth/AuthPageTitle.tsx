interface AuthPageTitleProps {
  title: string;
  onBack: () => void;
}

const AuthPageTitle = ({ title, onBack }: AuthPageTitleProps) => {
  return (
    <div className="flex items-center justify-center mb-8 relative">
      <button
        type="button"
        onClick={onBack}
        aria-label="이전 페이지로 이동"
        className="absolute left-0 text-white hover:text-gray-300"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h2 className="text-white text-2xl font-semibold">{title}</h2>
    </div>
  );
};

export default AuthPageTitle;
