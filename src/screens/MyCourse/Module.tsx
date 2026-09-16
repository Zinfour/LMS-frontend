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
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import ResourceCard from '@/components/ResourceCard';
import ActivityDialog from '@/components/ActivityDialog';
import ResourceDialog from '@/components/ResourceDialog';

export default function CourseModule() {
  const user = usePersistentStore((state) => state.user!);
  const { courseId, moduleId } = useParams();
  const {
    data: module,
    isLoading,
    error,
  } = useGetModuleById({ moduleId: Number(moduleId), courseId: Number(courseId ?? user.courseId), userId: user?.id });

  if (isLoading) {
    return (
      <div className="py-8">
        <Loading />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="py-8">
        <Error />
      </div>
    );
  }

  const isTeacher = user.role === 'teacher';

  return (
    <div className="py-6 px-2 flex gap-6 xl:gap-10 flex-col xl:flex-row">
      <div className="flex-1 space-y-4">
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
        <section className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <p className="text-muted-foreground text-xs font-light">
              {module.numberOfCompletedActivities} of {module.numberOfActivities} completed
            </p>
          </div>
          <Card className="gap-0 py-0">
            {module.activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <div className="relative hover:scale-101 hover:translate-x-1 transition-transform">
                  <Link to={`${activity.id}`}>
                    <ActivityCard activity={activity} idOfCurrentActivity={module.idOfCurrentActivity} />
                  </Link>
                  {isTeacher && (
                    <div className="absolute right-2 bottom-1">
                      <ActivityDialog moduleId={module.id} activity={activity} />
                    </div>
                  )}
                </div>
                {index < module.activities.length - 1 && <Separator className="h-px" />}
              </React.Fragment>
            ))}
          </Card>
        </section>
        {isTeacher && (<ActivityDialog moduleId={module.id} />)}
      </div>
      <div className="xl:w-[30%] xl:max-w-85 flex xl:flex-col gap-4">
        <Card className="hidden sm:flex flex-2 xl:flex-none">
          <CardHeader>
            <p className="text-muted-foreground text-xs font-light">MODULE PROGRESS</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold">{module.moduleProgress || 0}%</h3>
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
            <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
              {module.resources
                .filter(
                  (resource) =>
                    resource.resourceType === 'Link' ||
                    resource.resourceType === 'Reference' ||
                    resource.resourceType === 'Summary',
                )
                .map(
                  (resource) =>
                    resource.url && (
                      <ResourceCard
                        key={resource.id}
                        resource={{
                          name: resource.name,
                          url: resource.url,
                          description: resource.description,
                        }}
                        editDialog={
                          isTeacher ? (
                            <ResourceDialog moduleId={module.id} resourceType="Link" resource={resource} />
                          ) : undefined
                        }
                      />
                    ),
                )}
              {isTeacher && <ResourceDialog moduleId={module.id} resourceType="Link" buttonText="+ Add link" />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
