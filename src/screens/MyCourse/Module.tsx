import React from 'react';
import { useParams, Link } from 'react-router';
import useGetModuleById from '@/hooks/useGetModuleById';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import dayjs from 'dayjs';
import ActivityCard from '@/components/ActivityCard';
import { Progress } from '@/components/ui/progress';
import { buttonVariants } from '@/components/ui/button';
import CustomLink from '@/components/CustomLink';
import { cn } from '@/lib/utils';

export default function CourseModule() {
  const user = usePersistentStore((state) => state.user!);
  const { moduleId } = useParams();
  const {
    data: module,
    isLoading,
    error,
  } = useGetModuleById({ moduleId: Number(moduleId), courseId: user.courseId, userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !module) {
    return <div>Error, something went wrong.</div>;
  }

  return (
    <div className="py-6 px-2 flex gap-6 xl:gap-10 flex-col xl:flex-row">
      <div className="flex-1">
        <section>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-light">
            <p>
              MODULE <span className="mx-1">{module.id}</span> of{' '}
              <span className="mx-1">{module.totalNumberOfModules}</span>
            </p>
            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
            <p>
              {dayjs(module.startDate).format('DD')} - {dayjs(module.endDate).format('DD MMMM')}
            </p>
          </div>
          <h1 className="text-4xl font-bold mt-2 mb-4">{module.name}</h1>
          <p className="text-muted-foreground text-sm font-light leading-relaxed">{module.description}</p>
        </section>
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <p className="text-muted-foreground text-xs font-light">
              {module.numberOfCompletedActivities} of {module.numberOfActivities} completed
            </p>
          </div>
          <Card className="gap-0 py-0">
            {module.activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <Link className="hover:scale-101 hover:translate-x-1 transition-transform" to={`${activity.id}`}>
                  <ActivityCard activity={activity} idOfCurrentActivity={module.idOfCurrentActivity} />
                </Link>
                {index < module.activities.length - 1 && <Separator className="h-px" />}
              </React.Fragment>
            ))}
          </Card>
        </section>
      </div>
      <div className="xl:w-[30%] xl:max-w-85 flex xl:flex-col gap-4">
        <Card className="hidden sm:flex flex-2 xl:flex-none">
          <CardHeader>
            <p className="text-muted-foreground text-xs font-light">MODULE PROGRESS</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold">{module.moduleProgress}%</h3>
              <p className="text-muted-foreground font-light">
                {module.numberOfCompletedActivities} / {module.numberOfActivities} activities
              </p>
            </div>
            <Progress className="scale-y-200 mt-4 mb-3" value={module.moduleProgress} />
            <CustomLink
              to={`${module.currentActivityId}`}
              disabled={!module.currentActivityId}
              className={buttonVariants({ variant: 'default', className: 'w-full text-center py-5 mt-3' })}>
              Go to next activity
            </CustomLink>
          </CardContent>
        </Card>
        <Card className="flex-3 xl:flex-none">
          <CardHeader>
            <p className="text-muted-foreground text-xs font-light">RESOURCES</p>
          </CardHeader>
          <CardContent>
            <ul>
              {module.resources.map((resource) => (
                <li className="mb-4 last:mb-0" key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-150',
                      !resource.url && 'pointer-events-none opacity-50',
                    )}>
                    <div className="w-11 h-11 flex min-w-11 items-center justify-center bg-accent rounded-lg border-accent-foreground/20 border">
                      <p className="text-accent-foreground text-xs font-semibold">
                        {resource.resourceType.slice(0, 3)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-0.5 line-clamp-1">{resource.name}</h4>
                      <p className="text-muted-foreground text-xs line-clamp-2">{resource.description}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
