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

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-[2vw] py-[1vh] h-16 w-full">
      <div className="flex items-center gap-[1.5vw]">
        {showMenuButton && <MenuButton onClick={onMenuClick} />}
        <Brand onClick={() => navigate('/')} />
      </div>

      <AuthSection />
    </nav>
  );
};

export default NavBar;
