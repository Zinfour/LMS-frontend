import ModuleCard from '@/components/ModuleCard';
import CustomLink from '../../components/CustomLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import UserImage from '@/components/UserImage';
import useGetMyCourse from '@/hooks/useGetMyCourse';
import { useStore } from '@/hooks/useStore';
import dayjs from 'dayjs';

const COURSE = {
  id: 24,
  title: 'Frontend Development with React',
  description:
    'Build accessible, component-based interfaces with React and TypeScript. The course runs across five modules with weekly workshops, two hand-ins and a final project reviewed in pairs.',
  teacher: {
    id: 1,
    name: 'John Doe',
    imageURL: undefined,
  },
  yourProgress: {
    totalActivities: 31,
    numberOfCompletedActivities: 18,
    progressPercentage: 62,
  },
  status: 'in-progress',
  startDate: '2026-01-15',
  endDate: '2026-06-15',
  courseTag: 'FE26-REACT',
  dueSoonActivities: [10, 11],
  overdueActivities: [8],
  currentModule: {
    id: 3,
    title: 'Hooks & Context',
    description: 'Dive into React hooks and context API for state management and side effects.',
    status: 'in-progress',
    startDate: '2026-01-31',
    endDate: '2026-02-07',
    numberOfActivities: 4,
    numberOfResources: 2,
    numberOfCompletedActivities: 1,
    moduleNumber: 3,
  },
  modules: [
    {
      id: 1,
      title: 'Components & props',
      description: 'Learn how to create and use React components effectively, including props and state management.',
      status: 'completed',
      startDate: '2026-01-15',
      endDate: '2026-01-22',
      numberOfActivities: 5,
      numberOfResources: 3,
      numberOfCompletedActivities: 5,
      moduleNumber: 1,
    },
    {
      id: 2,
      title: 'State & Lifecycle',
      description: 'Understand how to manage state and lifecycle methods in React components.',
      status: 'overdue',
      startDate: '2026-01-23',
      endDate: '2026-01-30',
      numberOfActivities: 6,
      numberOfResources: 4,
      numberOfCompletedActivities: 5,
      moduleNumber: 2,
    },
    {
      id: 3,
      title: 'Hooks & Context',
      description: 'Dive into React hooks and context API for state management and side effects.',
      status: 'in-progress',
      startDate: '2026-01-31',
      endDate: '2026-02-07',
      numberOfActivities: 4,
      numberOfResources: 2,
      numberOfCompletedActivities: 1,
      moduleNumber: 3,
    },
    {
      id: 4,
      title: 'Advanced Patterns',
      description: 'Explore advanced React patterns for building scalable and maintainable applications.',
      status: 'not-started',
      startDate: '2026-02-08',
      endDate: '2026-02-15',
      numberOfActivities: 5,
      numberOfResources: 3,
      numberOfCompletedActivities: 0,
      moduleNumber: 4,
    },
    {
      id: 5,
      title: 'Testing & Debugging',
      description: 'Learn how to test and debug React applications effectively.',
      status: 'not-started',
      startDate: '2026-02-16',
      endDate: '2026-02-23',
      numberOfActivities: 4,
      numberOfResources: 2,
      numberOfCompletedActivities: 0,
      moduleNumber: 5,
    },
  ],
};

export default function MyCourse() {
  const user = useStore((state) => state.user);
  const { data: myCourse, isLoading, error } = useGetMyCourse({ userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Card className="lg:px-2 lg:py-6 bg-card-foreground">
        <CardContent className="flex flex-col sm:flex-row gap-4 lg:gap-10 text-card">
          <div>
            <div className="flex gap-2 items-center text-xs text-card/60 mb-5">
              <p>{COURSE.courseTag}</p>
              <div className="w-0.5 h-0.5 rounded-full bg-card/60"></div>
              <p>
                {dayjs(COURSE.startDate).format('DD MMM')} - {dayjs(COURSE.endDate).format('DD MMM YYYY')}
              </p>
              <Badge className="text-xs font-medium ml-2" variant="default">
                {COURSE.status}
              </Badge>
            </div>
            <h1 className="text-xl lg:text-3xl font-bold mb-3">{COURSE.title}</h1>
            <h2 className="leading-relaxed text-card/60 text-sm">{COURSE.description}</h2>
            <div className="flex items-center gap-2 mt-8">
              <UserImage size="small" username={COURSE.teacher.name} imageURL={COURSE.teacher.imageURL} />
              <p className="text-card/60">{COURSE.teacher.name} - Teacher</p>
            </div>
          </div>
          <Separator className="my-2 h-px sm:hidden" />
          <div className="w-full sm:w-[30%] max-w-100 mx-auto min-w-45 lg:min-w-55">
            <div className="flex justify-between items-center">
              <p className="text-card/60 font-light">Your progress</p>
              <p>{COURSE.yourProgress.progressPercentage}%</p>
            </div>
            <Progress className="scale-y-250 mt-4 mb-3" value={COURSE.yourProgress.progressPercentage} />
            <p className="text-card/60 font-light text-xs">
              {COURSE.yourProgress.numberOfCompletedActivities} of {COURSE.yourProgress.totalActivities} activities
              completed
            </p>
            <div className="mt-4 space-y-2">
              <Button className="w-full py-5">Continue: Module {COURSE.currentModule.moduleNumber}</Button>
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
          {COURSE.modules.map((module) => (
            <CustomLink
              className="flex hover:-translate-y-0.5 transition-transform duration-150"
              key={module.id}
              to={`${module.id}`}
              disabled={module.status === 'not-started'}>
              <ModuleCard module={module} />
            </CustomLink>
          ))}
        </div>
      </section>
    </div>
  );
}
