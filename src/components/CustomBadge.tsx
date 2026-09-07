// Badge component with custom colors
import { Badge } from '@/components/ui/badge';

export type CustomBadgeStatus = 'success' | 'error' | 'warning' | 'default' | 'noStatus';

export default function CustomBadge({
  children,
  className,
  status,
}: {
  children: React.ReactNode;
  status: CustomBadgeStatus;
  className?: string;
}) {
  let statusClass = '';
  let variant: 'default' | 'destructive' | 'secondary' = 'default';
  if (status === 'success') {
    statusClass = 'bg-success text-success-foreground';
  } else if (status === 'error') {
    // statusClass = 'bg-red-500 text-white';
    variant = 'destructive';
  } else if (status === 'warning') {
    statusClass = 'bg-warning text-warning-foreground';
  } else if (status === 'noStatus') {
    variant = 'secondary';
  }

  return (
    <Badge variant={variant} className={`${className ?? ''} ${statusClass}`}>
      {children}
    </Badge>
  );
}
