import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ResourceCard from '@/components/ResourceCard';
import dayjs from 'dayjs';
import SubmissionCard from '@/components/SubmissionCard';
import useGetSubmissionsForUser from '@/hooks/useGetSubmissionsForUser';
import type { ActivityResource } from '@/hooks/useGetModuleById';
import type { ResourceType } from '@/types';
import ResourceDialog from '@/components/ResourceDialog';

function getLatestResourcesByType(resources: ActivityResource[], type: ResourceType) {
  return resources
    .filter((resource) => resource.resourceType === type)
    .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf());
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

  const textMaterials = activity?.resources ? getLatestResourcesByType(activity.resources, 'TextMaterial') : [];

  const instructions = activity?.resources ? getLatestResourcesByType(activity.resources, 'Instruction') : [];

  const links = activity?.resources ? getLatestResourcesByType(activity.resources, 'Link') : [];

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

  const isTeacher = user.role == 'teacher';

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
            {textMaterials.map((textMaterial) => (
              <Card key={textMaterial.id} className="relative">
                <CardContent className={isTeacher ? 'space-y-2 pb-4' : 'space-y-2'}>
                  {textMaterial.description.split(/\r?\n/).map((line, index) => (
                    <p key={index} className="text-foreground">
                      {line}
                    </p>
                  ))}
                </CardContent>

                {isTeacher && (
                  <ResourceDialog activityId={activity.id} resourceType="TextMaterial" resource={textMaterial} />
                )}
              </Card>
            ))}

            {isTeacher && (
              <ResourceDialog activityId={activity.id} resourceType="TextMaterial" buttonText="+ Add text" />
            )}

            {/* Instructions */}
            {instructions.map((instruction) => (
              <Card key={instruction.id} className="relative">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Instructions</h2>
                </CardHeader>
                <CardContent className={isTeacher ? 'space-y-2 pb-4' : 'space-y-2'}>
                  {instruction.description.split(/\r?\n/).map((line, index) => (
                    <p key={index} className="text-foreground">
                      {line}
                    </p>
                  ))}
                </CardContent>

                {isTeacher && (
                  <ResourceDialog activityId={activity.id} resourceType="Instruction" resource={instruction} />
                )}
              </Card>
            ))}

            {isTeacher && activity.assignment && (
              <ResourceDialog activityId={activity.id} resourceType="Instruction" buttonText="+ Add instructions" />
            )}

            {/* Resources (links only) */}

            {links.length > 0 && (
              <Card>
                <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
                  {links.map(
                    (item) =>
                      item.url && (
                        <ResourceCard
                          key={item.id}
                          resource={{
                            name: item.name,
                            url: item.url,
                            description: item.description,
                          }}
                          editDialog={
                            isTeacher ? (
                              <ResourceDialog activityId={activity.id} resourceType="Link" resource={item} />
                            ) : undefined
                          }
                        />
                      ),
                  )}
                </CardContent>
              </Card>
            )}

            {isTeacher && <ResourceDialog activityId={activity.id} resourceType="Link" buttonText="+ Add link" />}
          </div>

          {/* Right column */}
          {!isTeacher && activity.assignment && (
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
