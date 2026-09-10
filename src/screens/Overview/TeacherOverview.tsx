import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { useTeacherOverview } from './useOverviewData';
import type { TeacherCourseStatus, TeacherReviewItem, TeacherReviewStatus } from './overview.types';
import KpiCard from './KpiCard';
import ProgressBar from './ProgressBar';

// Bold line above each deadline, e.g. "YESTERDAY" or "MON 7 SEP · 12:00".
function formatDeadlineDate(iso: string) {
  const date = dayjs(iso);
  const days = date.startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days === -1) return 'YESTERDAY';
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  return date.format('ddd D MMM · HH:mm').toUpperCase();
}

// Shown in the "Needs your review" SUBMITTED column, e.g. "5 Sep 09:14".
function formatSubmittedAt(iso: string) {
  return dayjs(iso).format('D MMM HH:mm');
}

// Small caps initials for the review avatars, derived from the student name.
function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function spellOut(n: number) {
  return NUMBER_WORDS[n] ?? String(n);
}

// Statuses the teacher can/should act on right now - based on urgency - the only ones "Needs your review" shows.
type ActionableReviewStatus = Extract<TeacherReviewStatus, 'late-awaiting' | 'awaiting-feedback'>;

// Lower shows first. `late-awaiting` is the higher-priority action.
const REVIEW_PRIORITY: Record<ActionableReviewStatus, number> = {
  'late-awaiting': 0,
  'awaiting-feedback': 1,
};

function isActionable(
  item: TeacherReviewItem,
): item is TeacherReviewItem & { reviewStatus: ActionableReviewStatus } {
  return item.reviewStatus === 'late-awaiting' || item.reviewStatus === 'awaiting-feedback';
}

function ReviewStatusBadge({ status }: { status: ActionableReviewStatus }) {
  if (status === 'late-awaiting') {
    return (
      <Badge
        variant="outline"
        className="border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
        Late · awaiting
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
      Awaiting feedback
    </Badge>
  );
}

const COURSE_STATUS: Record<TeacherCourseStatus, { label: string; dotClass: string }> = {
  published: { label: 'Published', dotClass: 'bg-emerald-500' },
  draft: { label: 'Draft', dotClass: 'bg-amber-500' },
};

export default function TeacherOverview() {
  const user = usePersistentStore((state) => state.user);
  const { data, isLoading } = useTeacherOverview();
  const firstName = user?.username?.split(' ')[0] ?? 'there';

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-72 rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  const { kpis, reviewQueue, deadlines, courses } = data;
  const awaiting = kpis.awaitingFeedback.value;
  const courseCount = courses.length;

  // Action queue: highest priority submissions the teacher should act on first.
  // status first, then longest-waiting first within a status.
  const reviewItems = reviewQueue
    .filter(isActionable)
    .sort(
      (a, b) =>
        REVIEW_PRIORITY[a.reviewStatus] - REVIEW_PRIORITY[b.reviewStatus] ||
        dayjs(a.submittedAt).valueOf() - dayjs(b.submittedAt).valueOf(),
    );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-xl p-6 ring-1 ring-border bg-foreground text-background dark:bg-card dark:text-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Good morning, {firstName}</h1>
            <p className="text-sm text-background/80 dark:text-foreground/80">
              {awaiting} {awaiting === 1 ? 'submission is' : 'submissions are'} waiting for feedback across your{' '}
              {spellOut(courseCount)} {courseCount === 1 ? 'course' : 'courses'}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" disabled title="Coming soon">
              Export grades (CSV)
            </Button>
            <Button disabled title="Coming soon">
              Review submissions
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Awaiting feedback"
          value={kpis.awaitingFeedback.value}
          caption={kpis.awaitingFeedback.caption}
          accentClassName="border-t-primary"
        />
        <KpiCard
          label="Late submissions"
          value={kpis.lateSubmissions.value}
          caption={kpis.lateSubmissions.caption}
          accentClassName="border-t-destructive"
        />
        <KpiCard
          label="Active students"
          value={kpis.activeStudents.value}
          caption={kpis.activeStudents.caption}
          accentClassName="border-t-emerald-500"
        />
        <KpiCard
          label="Unpublished drafts"
          value={kpis.unpublishedDrafts.value}
          caption={kpis.unpublishedDrafts.caption}
          accentClassName="border-t-amber-500"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Needs your review</h2>
              <button type="button" title="Coming soon" className="text-sm font-medium text-primary hover:underline">
                All submissions →
              </button>
            </div>
            <Card>
              <CardContent className="px-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Student</th>
                        <th className="px-4 py-2 font-medium">Activity</th>
                        <th className="px-4 py-2 font-medium">Review status</th>
                        <th className="px-4 py-2 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reviewItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                                aria-hidden="true">
                                {initials(item.studentName)}
                              </span>
                              <span className="font-medium">{item.studentName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.activityTitle}</td>
                          <td className="px-4 py-3">
                            <ReviewStatusBadge status={item.reviewStatus} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                            {formatSubmittedAt(item.submittedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My courses</h2>
              <button type="button" title="Coming soon" className="text-sm font-medium text-primary hover:underline">
                Manage →
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((course) => {
                const status = COURSE_STATUS[course.status];
                return (
                  <Card key={course.id}>
                    <CardContent className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-snug">{course.title}</h3>
                        <Badge variant="outline" className="shrink-0 gap-1.5">
                          <span className={cn('size-1.5 rounded-full', status.dotClass)} aria-hidden="true" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.studentCount} students · {course.moduleCount} modules · {course.activityCount}{' '}
                        activities
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Deadlines this week</h2>
            <Card>
              <CardContent className="divide-y divide-border px-0">
                {deadlines.map((deadline) => {
                  const { submissionsIn, submissionsTotal, note } = deadline;

                  return (
                    <div key={deadline.id} className="space-y-1 px-4 py-3 first:pt-0 last:pb-0">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {formatDeadlineDate(deadline.dueAt)}
                      </span>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      {submissionsIn != null && submissionsTotal != null ? (
                        <div className="space-y-1.5 pt-1">
                          <ProgressBar
                            value={submissionsTotal > 0 ? Math.round((submissionsIn / submissionsTotal) * 100) : 0}
                            label={`${deadline.title} submissions`}
                          />
                          <p className="text-xs text-muted-foreground">
                            {submissionsIn} / {submissionsTotal} in
                          </p>
                        </div>
                      ) : note ? (
                        <p className="text-xs text-muted-foreground">{note}</p>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
