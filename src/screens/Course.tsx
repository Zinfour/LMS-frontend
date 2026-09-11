import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import UserImage from '@/components/UserImage';
import useGetCourseById from '@/hooks/useGetCourseById';
import type { Course as CourseModel, Module as ModuleModel } from '@/hooks/useGetCourses';

function formatPeriod(startDate: string, endDate: string) {
  return `${dayjs(startDate).format('DD MMM YYYY')} – ${dayjs(endDate).format('DD MMM YYYY')}`;
}

function getTeacherName(teacher: CourseModel['teacher']) {
  const name = `${teacher.firstName} ${teacher.lastName}`.trim();
  return name.length > 0 ? name : null;
}

function BackLink() {
  return (
    <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
      ← Courses
    </Link>
  );
}

function CourseSummaryCard({ course }: { course: CourseModel }) {
  const teacherName = getTeacherName(course.teacher);
  const studentCount = course.students.length;
  const resourceCount = course.resources.length;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-4">
          {course.imageURL && (
            <img
              src={course.imageURL}
              alt=""
              className="size-16 shrink-0 rounded-lg bg-muted object-cover sm:size-20"
            />
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold leading-snug">{course.name}</h1>
            <p className="text-sm text-muted-foreground">{formatPeriod(course.startDate, course.endDate)}</p>
          </div>
        </div>

        {course.description && <p className="text-sm text-muted-foreground">{course.description}</p>}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {teacherName ? (
            <>
              <UserImage size="small" username={teacherName} imageURL={course.teacher.imageUrl ?? undefined} />
              <span>{teacherName}</span>
            </>
          ) : (
            <span>No teacher assigned</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {studentCount} {studentCount === 1 ? 'student' : 'students'} · {resourceCount}{' '}
          {resourceCount === 1 ? 'resource' : 'resources'}
        </p>
      </CardContent>
    </Card>
  );
}

function ModuleSummaryCard({ module }: { module: ModuleModel }) {
  return (
    <Card>
      {module.imageURL && <img src={module.imageURL} alt={module.name} className="h-28 w-full object-cover" />}
      <CardContent className="flex flex-col gap-2">
        <h3 className="font-medium leading-snug">{module.name}</h3>
        <p className="text-sm text-muted-foreground">{formatPeriod(module.startDate, module.endDate)}</p>
        {module.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{module.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Course() {
  const { courseId } = useParams();
  const id = Number(courseId);
  const validId = Number.isInteger(id) && id > 0;

  const { data: course, isLoading, isError, refetch } = useGetCourseById(validId ? id : undefined);

  if (!validId) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <BackLink />
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">Course not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <BackLink />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-44 w-full rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError || !course ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t load this course. It may not exist or the server is unavailable.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <CourseSummaryCard course={course} />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Modules</h2>
            {course.modules.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">This course has no modules yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {course.modules.map((module) => (
                  <ModuleSummaryCard key={module.id} module={module} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
