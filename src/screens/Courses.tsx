import dayjs from 'dayjs';
import { Link, NavLink } from 'react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import UserImage from '@/components/UserImage';
import useGetCourses, { type Course } from '@/hooks/useGetCourses';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import useDeleteCourse from '@/hooks/useDeleteCourse';

function formatPeriod(startDate: string, endDate: string) {
  return `${dayjs(startDate).format('DD MMM YYYY')} – ${dayjs(endDate).format('DD MMM YYYY')}`;
}

function getTeacherName(teacher: Course['teacher']) {
  const name = `${teacher.firstName} ${teacher.lastName}`.trim();
  return name.length > 0 ? name : null;
}

function CourseCard({ course }: { course: Course }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const teacherName = getTeacherName(course.teacher);
  const studentCount = course.students.length;
  // const resourceCount = course.resources.length;

  const { mutate: deleteCourse, isPending } = useDeleteCourse(course.id);

  const handleDelete = () => {
    setDialogOpen(false);
    deleteCourse();
  };

  return (
    <Card className="h-full flex flex-col pt-0 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <Link className="flex-1" key={course.id} to={`/courses/${course.id}`}>
        {course.imageURL && <img src={course.imageURL} alt={course.name} className="h-32 w-full object-cover" />}
        <CardContent className="flex flex-col gap-3 flex-1 pt-4">
          <div className="space-y-1">
            <h2 className="font-semibold leading-snug">{course.name}</h2>
            <p className="text-sm text-muted-foreground">{formatPeriod(course.startDate, course.endDate)}</p>
          </div>

          {course.description && (
            <div className="flex-1">
              <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Link>
      <div className="flex items-center justify-between mt-2 px-4">
        <div className="flex flex-col gap-2">
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
            {studentCount} {studentCount === 1 ? 'student' : 'students'}
          </p>
          {/* <p className="text-sm text-muted-foreground">
            {studentCount} {studentCount === 1 ? 'student' : 'students'} · {resourceCount}{' '}
            {resourceCount === 1 ? 'resource' : 'resources'}
          </p> */}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/courses/edit/${course.id}`}
            className={buttonVariants({ variant: 'outline', className: 'px-4 py-2' })}>
            Edit
          </Link>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled={isPending}
                  className="px-4 py-2"
                  variant="destructive">
                  {isPending ? 'Deleting...' : 'Delete'}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                <AlertDialogAction className="flex-1" onClick={handleDelete} variant="destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}

export default function Courses() {
  const { data: courses, isLoading, isError, refetch } = useGetCourses();

  return (
    <div className="space-y-6 mt-10">
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
        <div>
          <NavLink to="/courses/new" className={buttonVariants()}>
            Create a New Course
          </NavLink>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">No courses yet.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <NavLink to="/courses/new" className={buttonVariants({ className: 'px-8 py-5 absolute top-4 right-4' })}>
            Create a New Course
          </NavLink>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
