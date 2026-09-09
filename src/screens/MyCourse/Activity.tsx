import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { usePersistentStore } from '@/hooks/usePersistentStore';

export default function Activity() {
  const user = usePersistentStore((state) => state.user);
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
        <div>
          <h2 className="text-2xl font-bold mb-2">{activity.name}</h2>
          <p className="mb-4 text-muted-foreground">{activity.description}</p>
        </div>
      )}
    </div>
  );
}
