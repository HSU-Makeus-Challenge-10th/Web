import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useDeleteUserMutation } from '../auth/useDeleteUserMutation';
import { useAuth } from '../auth/useAuth';
import type { MenuItemDef } from '../../components/sidebar/SidebarItem';

export const useSidebarMenu = (onClose: () => void) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteUser } = useDeleteUserMutation();
  const { isLoggedIn } = useAuth();

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

  return {
    menuItems,
    isModalOpen,
    handleNavigation,
    handleConfirmDelete,
    closeModal: () => setIsModalOpen(false),
  };
};
