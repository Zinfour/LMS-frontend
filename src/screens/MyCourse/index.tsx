import ModuleCard from '@/components/ModuleCard';
import CustomLink from '../../components/CustomLink';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import UserImage from '@/components/UserImage';
import useGetMyCourse from '@/hooks/useGetMyCourse';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import dayjs from 'dayjs';
import CustomBadge from '@/components/CustomBadge';

export default function MyCourse() {
  const user = usePersistentStore((state) => state.user!);
  const { data: myCourse, isLoading, error } = useGetMyCourse({ courseid: user.courseId, userId: user?.id });
  console.log('myCourse', myCourse);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !myCourse) {
    return <div>Something went wrong 🫠!</div>;
  }

  return (
    <div>
      <Card className="lg:px-2 lg:py-6 bg-card-foreground">
        <CardContent className="flex flex-col sm:flex-row gap-4 lg:gap-10 text-card">
          <div>
            <div className="flex gap-2 items-center text-xs text-card/60 mb-5">
              {/* <p>{COURSE.courseTag}</p>
              <div className="w-0.5 h-0.5 rounded-full bg-card/60"></div> */}
              <p>
                {dayjs(myCourse?.startDate).format('DD MMM')} - {dayjs(myCourse.endDate).format('DD MMM YYYY')}
              </p>
              <CustomBadge
                className="text-xs font-medium ml-2"
                status={
                  myCourse.status === 'in-progress'
                    ? 'default'
                    : myCourse.status === 'completed'
                      ? 'success'
                      : 'noStatus'
                }>
                {myCourse.status === 'in-progress'
                  ? 'In progress'
                  : myCourse.status === 'completed'
                    ? 'Completed'
                    : 'Not started'}
              </CustomBadge>
            </div>
            <h1 className="text-xl lg:text-3xl font-bold mb-3">{myCourse.name}</h1>
            <h2 className="leading-relaxed text-card/60 text-sm">{myCourse.description}</h2>
            <div className="flex items-center gap-2 mt-8">
              <UserImage
                size="small"
                username={`${myCourse.teacher.firstName} ${myCourse.teacher.lastName}`}
                imageURL={myCourse.teacher.imageUrl}
              />
              <p className="text-card/60">{`${myCourse.teacher.firstName} ${myCourse.teacher.lastName}`} - Teacher</p>
            </div>
          </div>
          <Separator className="my-2 h-px sm:hidden" />
          <div className="w-full sm:w-[30%] max-w-100 mx-auto min-w-45 lg:min-w-55">
            <div className="flex justify-between items-center">
              <p className="text-card/60 font-light">Your progress</p>
              <p>{myCourse.userProgress.progressPercentage}%</p>
            </div>
            <Progress className="scale-y-250 mt-4 mb-3" value={myCourse.userProgress.progressPercentage} />
            <p className="text-card/60 font-light text-xs">
              {myCourse.userProgress.numberOfCompletedActivities} of {myCourse.userProgress.totalActivities} activities
              completed
            </p>
            <div className="mt-4 space-y-2">
              <CustomLink
                className={buttonVariants({ variant: 'default', className: 'w-full text-center py-5' })}
                to={`${myCourse.currentModuleId}`}
                disabled={!myCourse.currentModuleId}>
                Continue: Module {myCourse.currentModuleId ?? ''}
              </CustomLink>
              <Button variant="secondary" className="w-full py-5">
                Course syllabus (PDF)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <section className="mt-10 max-w-7xl">
        <h1 className="text-xl font-bold mb-4">Modules</h1>
        <div className="grid-cols-1 lg:grid-cols-2 grid gap-3">
          {myCourse.modules.map((module) => (
            <CustomLink
              className="flex hover:-translate-y-0.5 transition-transform duration-150"
              key={module.id}
              to={`${module.id}`}
              disabled={module.currentStatus === 'locked'}>
              <ModuleCard module={module} />
            </CustomLink>
          ))}
        </div>
      </section>
    </div>
  );
}
