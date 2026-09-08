import React from 'react';
import { useParams, Link } from 'react-router';
import useGetModuleById from '@/hooks/useGetModuleById';
import { useStore } from '@/hooks/useStore';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import dayjs from 'dayjs';
import ActivityCard from '@/components/ActivityCard';
import { Progress } from '@/components/ui/progress';
import { Button, buttonVariants } from '@/components/ui/button';

const MODULE = {
  id: 3,
  title: 'Hooks & Context',
  description:
    'Dive into React hooks and context API for state management and side effects. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  status: 'in-progress',
  startDate: '2026-01-31',
  endDate: '2026-02-07',
  numberOfActivities: 4,
  numberOfResources: 2,
  numberOfCompletedActivities: 1,
  moduleNumber: 3,
  totalNumberOfModules: 5,
  activities: [
    {
      id: 1,
      title: 'Lecture: Typing props and children',
      type: 'Lecture',
      duration: 45 * 60,
      numberOfResources: 3,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Workshop: Using useEffect',
      type: 'Workshop',
      duration: 50 * 90,
      numberOfResources: 2,
      status: 'completed',
    },
    {
      id: 3,
      title: 'Assignment: Using useContext',
      type: 'Assignment',
      duration: undefined,
      numberOfResources: 5,
      status: 'due-soon',
      dueDate: '2026-02-07 10:00',
      activeActivity: true,
    },
    {
      id: 4,
      title: 'Seminar: React Hooks',
      type: 'Seminar',
      duration: 30 * 60,
      numberOfResources: 1,
      status: 'not-started',
      startDate: '2026-02-07 14:00',
    },
    {
      id: 5,
      title: 'Hand-in: React Hooks Assignment',
      type: 'Assignment',
      duration: undefined,
      numberOfResources: 1,
      status: 'not-started',
      dueDate: '2026-02-07 16:00',
    },
  ],
  resources: [
    {
      id: 1,
      title: 'React Hooks Documentation',
      type: 'WEB',
      url: 'https://reactjs.org/docs/hooks-intro.html',
      descriptionShort: 'External link',
    },
    {
      id: 2,
      title: 'React TypeScript cheat sheet',
      type: 'PDF',
      url: 'https://reactjs.org/docs/context.html',
      descriptionShort: '1.2MB - 8 pages',
    },
    {
      id: 3,
      title: 'Walkthrough: generics',
      type: 'VID',
      url: 'https://reactjs.org/tutorial/tutorial.html',
      descriptionShort: '24 min',
    },
  ],
  moduleProgress: 40,
  currentActivityId: 3,
};

export default function CourseModule() {
  const user = useStore((state) => state.user);
  const { moduleId } = useParams();
  const { data: module, isLoading, error } = useGetModuleById({ moduleId: Number(moduleId), userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="py-6 px-2 flex gap-6 xl:gap-10 flex-col xl:flex-row">
      <div className="flex-1">
        <section>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-light">
            <p>
              MODULE <span className="mx-1">{MODULE.moduleNumber}</span> of{' '}
              <span className="mx-1">{MODULE.totalNumberOfModules}</span>
            </p>
            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
            <p>
              {dayjs(MODULE.startDate).format('DD')} - {dayjs(MODULE.endDate).format('DD MMMM')}
            </p>
          </div>
          <h1 className="text-4xl font-bold mt-2 mb-4">{MODULE.title}</h1>
          <p className="text-muted-foreground text-sm font-light leading-relaxed">{MODULE.description}</p>
        </section>
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <p className="text-muted-foreground text-xs font-light">
              {MODULE.numberOfCompletedActivities} of {MODULE.numberOfActivities} completed
            </p>
          </div>
          <Card className="gap-0 py-0">
            {MODULE.activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <Link className="hover:scale-101 hover:translate-x-1 transition-transform" to={`${activity.id}`}>
                  <ActivityCard activity={activity} />
                </Link>
                {index < MODULE.activities.length - 1 && <Separator className="h-px" />}
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
              <h3 className="text-4xl font-bold">{MODULE.moduleProgress}%</h3>
              <p className="text-muted-foreground font-light">
                {MODULE.numberOfCompletedActivities} / {MODULE.numberOfActivities} activities
              </p>
            </div>
            <Progress className="scale-y-200 mt-4 mb-3" value={MODULE.moduleProgress} />
            <Link
              to={`${MODULE.currentActivityId}`}
              className={buttonVariants({ variant: 'default', className: 'w-full text-center py-5 mt-3' })}>
              Go to next activity
            </Link>
          </CardContent>
        </Card>
        <Card className="flex-3 xl:flex-none">
          <CardHeader>
            <p className="text-muted-foreground text-xs font-light">RESOURCES</p>
          </CardHeader>
          <CardContent>
            <ul>
              {MODULE.resources.map((resource) => (
                <li className="flex items-center gap-4 mb-4 last:mb-0" key={resource.id}>
                  <div className="w-11 h-11 flex items-center justify-center bg-accent rounded-lg border-accent-foreground/20 border">
                    <p className="text-accent-foreground text-xs font-semibold">{resource.type}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-0.5">{resource.title}</h4>
                    <p className="text-muted-foreground text-xs">{resource.descriptionShort}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
