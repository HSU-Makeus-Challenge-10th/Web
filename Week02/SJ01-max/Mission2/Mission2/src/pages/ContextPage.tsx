import Navbar from '../components/Navbar';
import ThemeContent from '../components/ThemeContent';

const ContextPage = () => {
  return (
    <div className='min-h-screen bg-slate-100 transition-colors dark:bg-slate-950'>
      <Navbar />
      <main className='px-6 py-10'>
        <ThemeContent />
      </main>
    </div>
  );
};

export default ContextPage;
