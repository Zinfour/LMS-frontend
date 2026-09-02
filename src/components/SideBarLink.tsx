import { buttonVariants } from './ui/button';
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
          buttonVariants({ variant: 'ghost' }),
          'hover:opacity-100 border-0 flex items-center justify-start gap-4 py-5 px-2',
          {
            'opacity-100 bg-primary text-primary-foreground pointer-events-none': isActive,
            'opacity-50': !isActive,
          },
        )
      }
      to={to}>
      {icon && <span>{icon}</span>}
      {label}
    </NavLink>
  );
}
