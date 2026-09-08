import { Link } from 'react-router';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/hooks/useStore';
import { useStudentOverview } from './useOverviewData';
import type { StudentDeadlineStatus } from './overview.types';
import KpiCard from './KpiCard';
import StudentCourseCard from './StudentCourseCard';

// Bold line above each deadline, e.g. "YESTERDAY" or "THU 3 SEP · 23:59".
function formatDeadlineDate(iso: string) {
  const date = dayjs(iso);
  const days = date.startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days === -1) return 'YESTERDAY';
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  return date.format('ddd D MMM · HH:mm').toUpperCase();
}

function timeAgo(iso: string) {
  const days = dayjs().startOf('day').diff(dayjs(iso).startOf('day'), 'day');
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return dayjs(iso).format('D MMM YYYY');
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function DeadlineBadge({ status }: { status: StudentDeadlineStatus }) {
  if (status === 'overdue') return <Badge variant="destructive">Overdue</Badge>;
  if (status === 'due-soon') {
    return (
      <Badge
        variant="outline"
        className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
        Due soon
      </Badge>
    );
  }
  return <Badge variant="secondary">Not started</Badge>;
}

export default function StudentOverview() {
  const user = useStore((state) => state.user);
  const { data, isLoading } = useStudentOverview();
  const firstName = user?.username?.split(' ')[0] ?? 'there';

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  const { kpis, courses, deadlines, feedback } = data;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-xl p-6 ring-1 ring-border bg-foreground text-background dark:bg-card dark:text-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Hi {firstName} <span aria-hidden="true">👋</span>
            </h1>
            <p className="text-sm text-background/80 dark:text-foreground/80">
              You have {kpis.dueThisWeek} {kpis.dueThisWeek === 1 ? 'activity' : 'activities'} due this week.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" disabled title="Coming soon">
              This week
            </Button>
            <Link to="/my-course" className={buttonVariants({ variant: 'default' })}>
              Continue course
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active courses" value={kpis.activeCourses} accentClassName="border-t-primary" />
        <KpiCard
          label="Activities done"
          value={kpis.activitiesDone}
          total={kpis.activitiesTotal}
          accentClassName="border-t-emerald-500"
        />
        <KpiCard label="Due this week" value={kpis.dueThisWeek} accentClassName="border-t-amber-500" />
        <KpiCard label="Overdue" value={kpis.overdue} accentClassName="border-t-destructive" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My courses</h2>
            <Link to="/my-course" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <StudentCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Upcoming deadlines</h2>
            <Card>
              <CardContent className="divide-y divide-border px-0">
                {deadlines.map((deadline) => (
                  <div key={deadline.id} className="space-y-1 px-4 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {formatDeadlineDate(deadline.dueAt)}
                      </span>
                      <DeadlineBadge status={deadline.status} />
                    </div>
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.courseTitle} · {deadline.moduleLabel}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Recent feedback</h2>
            <Card>
              <CardContent className="divide-y divide-border px-0">
                {feedback.map((item) => (
                  <div key={item.id} className="flex gap-3 px-4 py-3 first:pt-0 last:pb-0">
                    <div
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                      aria-hidden="true">
                      {initials(item.authorName)}
                    </div>
                    <div className="space-y-0.5 text-sm">
                      <p>
                        <span className="font-medium">{item.authorName}</span> left feedback on{' '}
                        <span className="font-medium">{item.activityTitle}</span>.
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
