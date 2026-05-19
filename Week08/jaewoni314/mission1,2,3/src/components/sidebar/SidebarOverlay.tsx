interface SidebarOverlayProps {
  isOpen: boolean;
  isLargeScreen: boolean;
  onClose: () => void;
}

const SidebarOverlay = ({
  isOpen,
  isLargeScreen,
  onClose,
}: SidebarOverlayProps) => {
  if (isLargeScreen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    />
  );
};

export default SidebarOverlay;
