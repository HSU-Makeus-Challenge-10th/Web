import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuButton from './MenuButton';
import Brand from './Brand';
import AuthSection from './AuthSection';

interface NavBarProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

const NavBar = ({ onMenuClick, showMenuButton = true }: NavBarProps) => {
  const navigate = useNavigate();

  const handleBrandClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleMenuClick = useCallback(() => {
    onMenuClick();
  }, [onMenuClick]);

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-4 md:px-6 py-2 md:py-3 h-16 w-full">
      <div className="flex items-center gap-4 md:gap-6">
        {showMenuButton && <MenuButton onClick={handleMenuClick} />}
        <Brand onClick={handleBrandClick} />
      </div>

      <AuthSection />
    </nav>
  );
};

export default NavBar;
