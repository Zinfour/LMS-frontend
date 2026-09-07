import { Link } from 'react-router';

export default function CustomLink({
  to,
  children,
  className,
  disabled,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className={`${className ?? ''} cursor-not-allowed event-none pointer-events-none opacity-70`}>
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={`${className ?? ''}`}>
      {children}
    </Link>
  );
}
