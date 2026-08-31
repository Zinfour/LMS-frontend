import { NavLink } from 'react-router';
import { buttonVariants } from './ui/button';
import { cn } from '../lib/utils';

const Link = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(buttonVariants({ variant: 'link' }), 'hover:opacity-100', {
          'opacity-100': isActive,
          'opacity-50': !isActive,
        })
      }
      to={to}>
      {children}
    </NavLink>
  );
};

export default function NavBar() {
  return (
    <nav className="bg-card p-4">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/movies">Movies</Link>
      <Link to="/form-example">Form Example</Link>
    </nav>
  );
}
