import { MdCheck, MdKeyboardArrowRight } from 'react-icons/md';
import CustomBadge, { type CustomBadgeStatus } from './CustomBadge';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import type { Activity } from '@/hooks/useGetModuleById';

export default function ActivityCard({
  activity,
  idOfCurrentActivity,
}: {
  activity: Activity;
  idOfCurrentActivity: number | null;
}) {
  let badgeStatus: CustomBadgeStatus = 'noStatus';
  // if (activity.completed === 'completed') {
  //   badgeStatus = 'success';
  // } else if (activity.status === 'due-soon') {
  //   badgeStatus = 'warning';
  // } else if (activity.status === 'not-started') {
  //   badgeStatus = 'noStatus';
  // }
  if (activity.completed) {
    badgeStatus = 'success';
  }

  const isCurrentActivity = idOfCurrentActivity === activity.id;
  // const durationInMinutes = dayjs(activity.endTime).diff(dayjs(activity.startTime), 'minute');
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-4 px-4 py-6 border-l-4 border-transparent sm:items-center sm:flex-row',
        isCurrentActivity && 'border-l-4 border-primary',
      )}>
      <div className="flex-1 flex gap-4 items-center">
        <div
          className={cn(
            'rounded-full p-2 w-8.5 h-8.5',
            badgeStatus === 'success' && 'bg-success',
            badgeStatus !== 'success' && 'border-2 border-muted-foreground/80',
            badgeStatus !== 'success' && isCurrentActivity && 'border-2 border-primary',
          )}>
          {badgeStatus === 'success' && <MdCheck className="text-success-foreground" size={18} />}
        </div>
        <div className="flex-1">
          <h3 className="xl:text-lg font-semibold">{activity.name}</h3>
          <div className="flex items-center flex-wrap gap-2 text-muted-foreground text-sm font-light mt-0.5">
            <p>{activity.type}</p>
            {/* {durationInMinutes && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{durationInMinutes && `${durationInMinutes} min`}</p>
              </>
            )} */}
            {activity.resources.length > 0 && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{`${activity.resources.length} resources`}</p>
              </>
            )}
            {activity.endTime && (
              <>
                <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                <p>{activity.endTime && `Due: ${dayjs(activity.endTime).format('ddd DD MMM HH:mm')}`}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between sm:justify-start">
        <CustomBadge status={badgeStatus}>{activity.completed ? 'completed' : 'not-started'}</CustomBadge>
        <MdKeyboardArrowRight size={18} />
      </div>
    </div>
  );
}
