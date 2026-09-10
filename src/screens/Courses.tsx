import dayjs from 'dayjs';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import UserImage from '@/components/UserImage';
import useGetCourses, { type Course } from '@/hooks/useGetCourses';

function formatPeriod(startDate: string, endDate: string) {
  return `${dayjs(startDate).format('DD MMM YYYY')} – ${dayjs(endDate).format('DD MMM YYYY')}`;
}

function getTeacherName(teacher: Course['teacher']) {
  const name = `${teacher.firstName} ${teacher.lastName}`.trim();
  return name.length > 0 ? name : null;
}

function CourseCard({ course }: { course: Course }) {
  const teacherName = getTeacherName(course.teacher);
  const studentCount = course.students.length;
  const resourceCount = course.resources.length;

  return (
    <Card>
      {course.imageURL && <img src={course.imageURL} alt={course.name} className="h-32 w-full object-cover" />}
      <CardContent className="flex flex-col gap-3">
        <div className="space-y-1">
          <h2 className="font-medium leading-snug">{course.name}</h2>
          <p className="text-sm text-muted-foreground">{formatPeriod(course.startDate, course.endDate)}</p>
        </div>

        {course.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
        )}

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

export default function Courses() {
  const { data: courses, isLoading, isError, refetch } = useGetCourses();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Courses</h1>
        {courses && courses.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </p>
        )}
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <p className="text-sm text-muted-foreground">We couldn&apos;t load your courses.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : !courses || courses.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">No courses yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
