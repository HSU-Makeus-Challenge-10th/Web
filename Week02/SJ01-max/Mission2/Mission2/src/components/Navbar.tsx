import ThemeToggleButton from './ThemeToggleButton';

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900'>
      <h1 className='text-lg font-bold text-slate-900 dark:text-slate-100'>Context API Theme</h1>
      <ThemeToggleButton />
    </nav>
  );
};

export default Navbar;
