import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ResourceCard from '@/components/ResourceCard';
import dayjs from 'dayjs';
import SubmissionCard from '@/components/SubmissionCard';
import useGetSubmissionsForUser from '@/hooks/useGetSubmissionsForUser';

export default function Activity() {
  const user = usePersistentStore((state) => state.user);
  const { activityId } = useParams();

  const {
    data: activity,
    isLoading,
    error: error1,
  } = useGetActivityById({
    activityId: Number(activityId),
    userId: user?.id,
  });

  const {
    data: submissions,
    isLoading: isLoading2,
    error: error2,
  } = useGetSubmissionsForUser({
    userId: user?.id,
  });

  if (user == null || submissions == undefined) {
    return null;
  }

  if (isLoading || isLoading2) {
    return <div>Loading...</div>;
  }

  if (error1) {
    return <div>Error: {error1.message}</div>;
  }

  if (error2) {
    return <div>Error: {error2.message}</div>;
  }

  return (
    <div>
      {activity && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
          {/* Main activity content */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* Headliner card */}
            <Card className="bg-foreground text-background dark:bg-card dark:text-foreground">
              <CardHeader>
                <h2 className="text-2xl font-bold">{activity.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-background/80 dark:text-muted-foreground">{activity.description}</p>
                {activity.deadline && (
                  <p className="text-background/80 dark:text-muted-foreground pt-2">{`Deadline: ${dayjs(activity.deadline).format('DD/MM/YYYY')}`}</p>
                )}
              </CardContent>
            </Card>
            {/* TextMaterial */}
            {activity.textMaterial && (
              <Card>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{activity.textMaterial}</p>
                </CardContent>
              </Card>
            )}
            {/* Instructions */}
            {activity.instructions && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Instructions</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{activity.instructions}</p>
                </CardContent>
              </Card>
            )}
            {/* Resources */}
            {activity.resources && (activity.resources.length > 0 || user?.role === 'teacher') ? (
              <Card>
                <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
                  {activity.resources.map((item, index) => (
                    <ResourceCard key={index} resource={item} />
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
          {/* Right column */}
          <div className="w-full lg:sticky lg:top-4 lg:self-start">
            <SubmissionCard
              activity={activity}
              submission={submissions.length === 0 ? undefined : submissions[0]}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
}
