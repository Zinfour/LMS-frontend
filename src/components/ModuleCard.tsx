import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '../lib/utils';
import dayjs from 'dayjs';
import CustomBadge, { type CustomBadgeStatus } from './CustomBadge';
import type { Module } from '@/hooks/useGetMyCourse';

// !TODO! Update typing when we know the exact structure we get from backe
export default function ModuleCard({ module }: { module: Module }) {
  const isCompleted = module.currentStatus === 'completed';
  const isOverdue = module.currentStatus === 'overdue';
  // const isInProgress = module.currentStatus === 'in-progress';
  const isNotStarted = module.currentStatus === 'locked';

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
        'border-2 border-primary shadow-lg': module.currentStatus === 'inProgress',
      })}>
      <CardHeader className="flex items-center justify-between ">
        <div className="flex gap-2 items-center text-xs font-light text-muted-foreground">
          <p>MODULE {module.id}</p>
          <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></div>
          <p>
            {dayjs(module.startDate).format('DD')} - {dayjs(module.endDate).format('DD MMM')}
          </p>
        </div>
        <CustomBadge status={badgeVariant}>{module.currentStatus}</CustomBadge>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{module.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{module.description}</p>
        </div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2 text-muted-foreground font-light">
            <p>{module.activitiesNumber} activities</p>
            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground"></div>
            <p>{module.resourcesNumber} resources</p>
          </div>
          <p className="font-semibold">
            {module.numberOfCompletedActivities} / {module.activitiesNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
