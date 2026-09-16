import ModuleCard from '@/components/ModuleCard';
import ModuleDialog from '@/components/ModuleDialog';
import CustomLink from '@/components/CustomLink';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import UserImage from '@/components/UserImage';
import dayjs from 'dayjs';
import CustomBadge from '@/components/CustomBadge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import type { ParsedCourseData } from '@/hooks/useGetCourseById';
import { usePersistentStore } from '@/hooks/usePersistentStore';

interface Props {
  course: ParsedCourseData;
}

export default function CourseScreenContent({ course }: Props) {
  const user = usePersistentStore((state) => state.user!);
  const isStudent = user.role === 'student';
  return (
    <div>
      <Card className="lg:px-2 lg:py-6 bg-card-foreground">
        <CardContent className="flex flex-col sm:flex-row gap-4 lg:gap-10 text-card">
          <div>
            <div className="flex gap-2 items-center text-xs text-card/60 mb-5">
              <p>
                {dayjs(course?.startDate).format('DD MMM')} - {dayjs(course.endDate).format('DD MMM YYYY')}
              </p>
              <CustomBadge
                className="text-xs font-medium ml-2"
                status={
                  course.status === 'in-progress' ? 'default' : course.status === 'completed' ? 'success' : 'noStatus'
                }>
                {course.status === 'in-progress'
                  ? 'In progress'
                  : course.status === 'completed'
                    ? 'Completed'
                    : 'Not started'}
              </CustomBadge>
            </div>
            <h1 className="text-xl lg:text-3xl font-bold mb-3">{course.name}</h1>
            <h2 className="leading-relaxed text-card/60 text-sm">{course.description}</h2>
            <div className="flex items-center gap-3 mt-8">
              <UserImage
                size="small"
                username={`${course.teacher.firstName} ${course.teacher.lastName}`}
                imageURL={course.teacher.imageUrl}
              />
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium text-card/60">
                  {course.teacher.firstName} {course.teacher.lastName} - <span className="italic">Teacher</span>
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-2 h-px sm:hidden" />
          <div className="w-full sm:w-[30%] max-w-100 mx-auto min-w-45 lg:min-w-55">
            {isStudent && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-card/60 font-light">Your progress</p>
                  <p>{course.userProgress.progressPercentage}%</p>
                </div>
                <Progress className="scale-y-250 mt-4 mb-3" value={course.userProgress.progressPercentage} />
                <p className="text-card/60 font-light text-xs">
                  {course.userProgress.numberOfCompletedActivities} of {course.userProgress.totalActivities} activities
                  completed
                </p>
              </>
            )}
            <div className="mt-4 space-y-2">
              <CustomLink
                className={buttonVariants({ variant: 'default', className: 'w-full text-center py-5' })}
                to={`${course.currentModuleId}`}
                disabled={!course.currentModuleId}>
                Continue: Module {course.currentModuleId ?? ''}
              </CustomLink>
              <Dialog>
                <DialogTrigger render={<Button variant="secondary" className="w-full py-5" />}>
                  View participants ({course.students.length})
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Course participants</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>{course.students.length} participants in this course</DialogDescription>
                  <div className="space-y-3 mt-2 max-h-80 overflow-y-auto pr-1">
                    {course.students.map((student) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <UserImage
                          size="small"
                          username={`${student.firstName} ${student.lastName}`}
                          imageURL={student.imageUrl}
                        />
                        <div>
                          <p>
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">Student</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <section className="mt-10 max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Modules</h1>
          {!isStudent && <ModuleDialog courseId={course.id} userId={user.id} />}
        </div>
        <div className="grid-cols-1 lg:grid-cols-2 grid gap-3">
          {course.modules.map((module) => (
            <div key={module.id} className="relative flex">
              <CustomLink
                className="flex flex-1 hover:-translate-y-0.5 transition-transform duration-150"
                to={`${module.id}`}
                disabled={isStudent && module.currentStatus === 'locked'}>
                <ModuleCard module={module} />
              </CustomLink>
              
              {!isStudent && (
                <div className="absolute top-4 right-4 z-10">
                  <ModuleDialog
                    courseId={course.id}
                    userId={user.id}
                    moduleId={module.id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
