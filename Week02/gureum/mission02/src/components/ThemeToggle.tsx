import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="다크모드 토글"
      className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg transition-colors duration-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
