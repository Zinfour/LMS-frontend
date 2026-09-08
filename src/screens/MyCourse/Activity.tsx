import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { useStore } from '@/hooks/useStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ResourceCard from '@/components/ResourceCard';

export default function Activity() {
  const user = useStore((state) => state.user);
  const { activityId } = useParams();
  const { data: activity, isLoading, error } = useGetActivityById({ activityId: Number(activityId), userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {activity && (
        <div className="gap-4 flex flex-col">
          {/* Headliner card */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">{activity.name}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{activity.description}</p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.instructions}</p>
              </CardContent>
            </Card>
          )}
          {/* Resources (Links) */}
          {activity.resources && (activity.resources.length > 0 || user?.role == 'teacher') ? (
            <Card>
              <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
                {activity.resources.map((item, index) => (
                  <ResourceCard key={index} resource={item} />
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
