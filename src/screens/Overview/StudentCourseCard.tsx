import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ProgressBar from './ProgressBar';
import type { StudentCourseStatus, StudentCourseSummary } from './overview.types';

const STATUS: Record<StudentCourseStatus, { label: string; dotClass: string }> = {
  'in-progress': { label: 'In progress', dotClass: 'bg-primary' },
  'due-soon': { label: 'Due soon', dotClass: 'bg-amber-500' },
  completed: { label: 'Completed', dotClass: 'bg-emerald-500' },
};

export default function StudentCourseCard({ course }: { course: StudentCourseSummary }) {
  const status = STATUS[course.status];

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted p-1 text-center text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground"
            aria-hidden="true">
            Course cover
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-medium leading-snug">{course.title}</h3>
              <Badge variant="outline" className="gap-1.5">
                <span className={cn('size-1.5 rounded-full', status.dotClass)} aria-hidden="true" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {course.teacher} · {course.moduleCount} modules · {course.credits} YH credits
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">{course.progressLabel}</span>
            <span className="font-medium tabular-nums">{course.progressPercent}%</span>
          </div>
          <ProgressBar
            value={course.progressPercent}
            label={`${course.title} progress`}
            indicatorClassName={course.status === 'completed' ? 'bg-emerald-500' : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
}
