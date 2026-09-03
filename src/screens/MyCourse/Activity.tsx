import { useParams } from 'react-router';
import useGetActivityById from '@/hooks/useGetActivityById';
import { useStore } from '@/hooks/useStore';

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
        <div>
          <h2 className="text-2xl font-bold mb-2">{activity.name}</h2>
          <p className="mb-4 text-muted-foreground">{activity.description}</p>
        </div>
      )}
    </div>
  );
}
