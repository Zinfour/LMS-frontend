import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  /** Total number of activities. */  total?: number;
  /** Sets the color at the top of the card. */
  accentClassName?: string;
}

export default function KpiCard({ label, value, total, accentClassName }: KpiCardProps) {
  return (
    <Card className={cn('gap-0 border-t-4 border-t-border', accentClassName)}>
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {value}
          {total != null && <span className="ml-1 text-base font-normal text-muted-foreground">/ {total}</span>}
        </span>
      </CardContent>
    </Card>
  );
}
