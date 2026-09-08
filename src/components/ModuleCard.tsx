import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '../lib/utils';
import dayjs from 'dayjs';
import CustomBadge, { type CustomBadgeStatus } from './CustomBadge';

// !TODO! Update typing when we know the exact structure we get from backe
export default function ModuleCard({ module }: { module: any }) {
  const isCompleted = module.status === 'completed';
  const isOverdue = module.status === 'overdue';
  // const isInProgress = module.status === 'in-progress';
  const isNotStarted = module.status === 'not-started';

  let badgeVariant: CustomBadgeStatus = 'default';

  if (isOverdue) {
    badgeVariant = 'error';
  } else if (isCompleted) {
    badgeVariant = 'success';
  } else if (isNotStarted) {
    badgeVariant = 'noStatus';
  }

  return (
    <Card
      className={cn('flex-1', {
        'border-2 border-primary shadow-lg': module.status === 'in-progress',
      })}>
      <CardHeader className="flex items-center justify-between ">
        <div className="flex gap-2 items-center text-xs font-light text-muted-foreground">
          <p>MODULE {module.moduleNumber}</p>
          <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></div>
          <p>
            {dayjs(module.startDate).format('DD')} - {dayjs(module.endDate).format('DD MMM')}
          </p>
        </div>
        <CustomBadge status={badgeVariant}>{module.status}</CustomBadge>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{module.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{module.description}</p>
        </div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2 text-muted-foreground font-light">
            <p>{module.numberOfActivities} activities</p>
            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></div>
            <p>{module.numberOfResources} resources</p>
          </div>
          <p className="font-semibold">
            {module.numberOfCompletedActivities} / {module.numberOfActivities}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
