import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import SidebarItem, { type MenuItemDef } from './SidebarItem';
import Modal from '../modal/Modal';
import { useDeleteUserMutation } from '../../hooks/auth/useDeleteUserMutation';
import { useAuth } from '../../hooks/auth/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLargeScreen: boolean;
}

const Sidebar = ({ isOpen, onClose, isLargeScreen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteUser } = useDeleteUserMutation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isLargeScreen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    if (isOpen && !isLargeScreen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isLargeScreen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteUser();
    setIsModalOpen(false);
  };

  const menuItems: (MenuItemDef & { action?: () => void })[] = [
    { icon: Search, label: '찾기', path: '/search' },
    { icon: User, label: '마이페이지', path: '/mypage' },
  ];

  if (isLoggedIn) {
    menuItems.push({
      icon: LogOut,
      label: '탈퇴하기',
      path: '#',
      action: handleOpenModal,
    });
  }

  return (
    <>
      {!isLargeScreen && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-[18vw] min-w-64 bg-gray-900 z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-[1.5vw]">
          <ul className="space-y-[0.8vh]">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label}>
                  <SidebarItem
                    item={item}
                    active={isActive && !item.action}
                    onClick={() =>
                      item.action ? item.action() : handleNavigation(item.path)
                    }
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        content="정말로 탈퇴하시겠습니까?"
      />
    </>
  );
};

export default Sidebar;
