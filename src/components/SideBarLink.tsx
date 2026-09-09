import { cn } from '../lib/utils';
import { NavLink } from 'react-router';

interface Props {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export default function SideBarLink({ to, label, icon }: Props) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex items-center justify-start gap-4 rounded-md px-2 py-2 text-sm font-medium',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          isActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/80'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
        )
      }
      to={to}>
      {icon && <span>{icon}</span>}
      {label}
    </NavLink>
  );
}
