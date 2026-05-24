import { useRef } from 'react';
import Modal from '../modal/Modal';
import SidebarOverlay from './SidebarOverlay';
import SidebarMenu from './SidebarMenu';
import { useClickOutside } from '../../hooks/sidebar/useClickOutside';
import { useSidebarMenu } from '../../hooks/sidebar/useSidebarMenu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLargeScreen: boolean;
}

const Sidebar = ({ isOpen, onClose, isLargeScreen }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    menuItems,
    isModalOpen,
    handleNavigation,
    handleConfirmDelete,
    closeModal,
  } = useSidebarMenu(onClose);

  useClickOutside(sidebarRef, isOpen, isLargeScreen, onClose);

  return (
    <>
      <SidebarOverlay
        isOpen={isOpen}
        isLargeScreen={isLargeScreen}
        onClose={onClose}
      />

      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 lg:w-72 xl:w-80 bg-gray-900 z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarMenu menuItems={menuItems} onNavigation={handleNavigation} />
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        content="정말로 탈퇴하시겠습니까?"
      />
    </>
  );
};

export default Sidebar;
