import { useLocation } from 'react-router-dom';
import SidebarItem, { type MenuItemDef } from './SidebarItem';

interface SidebarMenuProps {
  menuItems: (MenuItemDef & { action?: () => void })[];
  onNavigation: (path: string) => void;
}

const SidebarMenu = ({ menuItems, onNavigation }: SidebarMenuProps) => {
  const location = useLocation();

  return (
    <nav className="p-4 lg:p-6">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.label}>
              <SidebarItem
                item={item}
                active={isActive && !item.action}
                onClick={() =>
                  item.action ? item.action() : onNavigation(item.path)
                }
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
