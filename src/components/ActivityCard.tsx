import { MdCheck, MdKeyboardArrowRight } from 'react-icons/md';
import CustomBadge, { type CustomBadgeStatus } from './CustomBadge';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

export default function ActivityCard({ activity }: any) {
  let badgeStatus: CustomBadgeStatus = 'default';
  if (activity.status === 'completed') {
    badgeStatus = 'success';
  } else if (activity.status === 'due-soon') {
    badgeStatus = 'warning';
  } else if (activity.status === 'not-started') {
    badgeStatus = 'noStatus';
  }

  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-4 px-4 py-6 border-l-4 border-transparent sm:items-center sm:flex-row',
        activity.activeActivity && 'border-l-4 border-primary',
      )}>
      <div className="flex-1 flex gap-4 items-center">
        <div
          className={cn(
            'rounded-full p-2 w-8.5 h-8.5',
            badgeStatus === 'success' && 'bg-success',
            badgeStatus !== 'success' && 'border-2 border-muted-foreground/80',
            badgeStatus !== 'success' && activity.activeActivity && 'border-2 border-primary',
          )}>
          {badgeStatus === 'success' && <MdCheck className="text-success-foreground" size={18} />}
        </div>
        <div className="flex-1">
          <h3 className="xl:text-lg font-semibold">{activity.title}</h3>
          <div className="flex items-center flex-wrap gap-2 text-muted-foreground text-sm font-light mt-0.5">
            <p>{activity.type}</p>
            {activity.duration && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{activity.duration && `${activity.duration / 60} min`}</p>
              </>
            )}
            {activity.numberOfResources && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{activity.numberOfResources && `${activity.numberOfResources} resources`}</p>
              </>
            )}
            {activity.dueDate && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{activity.dueDate && `Due: ${dayjs(activity.dueDate).format('ddd DD MMM HH:mm')}`}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between sm:justify-start">
        <CustomBadge status={badgeStatus}>{activity.status}</CustomBadge>
        <MdKeyboardArrowRight size={18} />
      </div>
    </div>
  );
}

// flex items-center gap-4 px-4 py-6 border-l-4 border-transparent
