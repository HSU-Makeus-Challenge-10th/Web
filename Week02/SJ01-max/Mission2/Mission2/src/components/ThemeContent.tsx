import { useTheme } from '../context/useTheme';

const ThemeContent = () => {
  const { theme } = useTheme();

  return (
    <section className='mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
      <h2 className='mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100'>
        {theme === 'dark' ? '다크 모드' : '라이트 모드'}
      </h2>
      <p className='leading-relaxed text-slate-600 dark:text-slate-300'>
        Context API로 전역 테마 상태를 관리하고 있으며, 네비게이션의 버튼을 누르면 전체 페이지의
        배경과 텍스트 색상이 함께 변경됩니다.
      </p>
    </section>
  );
};

export default ThemeContent;
