import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ResourceCard from '@/components/ResourceCard';
import dayjs from 'dayjs';
import SubmissionCard from '@/components/SubmissionCard';
import useGetSubmissionsForUser from '@/hooks/useGetSubmissionsForUser';
import type { ActivityResource } from '@/hooks/useGetModuleById';

function getLatestResourceByType(resources: ActivityResource[], type: ActivityResource['resourceType']) {
  return resources
    .filter((r) => r.resourceType === type)
    .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())[0];
}

function getLinksSortedByCreatedAt(resources: ActivityResource[]) {
  return resources
    .filter((r) => r.resourceType === 'Link')
    .sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());
}

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

  const hasAssignment = !!activity?.assignment;

  const {
    data: submissions,
    isLoading: isLoading2,
    error: error2,
  } = useGetSubmissionsForUser({
    userId: user?.id,
    assignmentId: activity?.assignment?.id,
    enabled: hasAssignment,
  });

  const textMaterial = activity?.resources ? getLatestResourceByType(activity.resources, 'TextMaterial') : undefined;

  const instructions = activity?.resources ? getLatestResourceByType(activity.resources, 'Instruction') : undefined;

  const links = activity?.resources ? getLinksSortedByCreatedAt(activity.resources) : [];

  if (user == null) {
    return null;
  }

  if (isLoading || (hasAssignment && isLoading2)) {
    return <div>Loading...</div>;
  }

  if (error1) {
    return <div>Error: {error1.message}</div>;
  }

  if (hasAssignment && error2) {
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
                {activity.assignment && (
                  <p className="text-background/80 dark:text-muted-foreground pt-2">{`Deadline: ${dayjs(activity.assignment.deadline).format('DD/MM/YYYY')}`}</p>
                )}
              </CardContent>
            </Card>
            {/* TextMaterial */}
            {textMaterial && (
              <Card>
                <CardContent className="space-y-2">
                  {textMaterial.description.split(/\r?\n/).map((line, index) => (
                    <p key={index} className="text-foreground">
                      {line}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Instructions */}
            {instructions && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Instructions</h2>
                </CardHeader>
                <CardContent className="space-y-2">
                  {instructions.description.split(/\r?\n/).map((line, index) => (
                    <p key={index} className="text-foreground">
                      {line}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Resources (links only) */}
            {links.length > 0 || user?.role === 'teacher' ? (
              <Card>
                <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
                  {links.map(
                    (item) =>
                      item.url && (
                        <ResourceCard
                          key={item.id}
                          resource={{ name: item.name, url: item.url, description: item.description }}
                        />
                      ),
                  )}
                </CardContent>
                {/* TODO: add an add resource button here for teachers. */}
              </Card>
            ) : null}
          </div>
          {/* Right column */}
          {activity.assignment && (
            <div className="w-full lg:sticky lg:top-4 lg:self-start">
              <SubmissionCard
                assignment={activity.assignment}
                submission={submissions?.length ? submissions[0] : undefined}
                user={user}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
