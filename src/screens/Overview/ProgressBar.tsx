import { cn } from '@/lib/utils';

interface ProgressBarProps {
  /** 0–100. */
  value: number;
  /** Accessible name for the bar. */
  label: string;
  className?: string;
  indicatorClassName?: string;
}

export default function ProgressBar({ value, label, className, indicatorClassName }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full bg-primary transition-[width]', indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
