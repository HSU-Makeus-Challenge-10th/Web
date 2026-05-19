import type { ComponentType, SVGProps } from 'react';
import Button from '../button/Button';

export interface MenuItemDef {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
}

interface SidebarItemProps {
  item: MenuItemDef;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ item, active, onClick }: SidebarItemProps) => {
  const Icon = item.icon;

  return (
    <Button
      onClick={onClick}
      variant={active ? 'primary' : 'ghost'}
      fullWidth
      className="justify-start gap-3"
    >
      <Icon className="w-5 h-5" />
      <span className="text-base font-medium">{item.label}</span>
    </Button>
  );
};

export default SidebarItem;
