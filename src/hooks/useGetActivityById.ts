import { useQuery } from '@tanstack/react-query';
import type { Activity } from '@/hooks/useGetModuleById';
import { api } from '@/api';

const useGetActivityById = ({ activityId, userId }: { activityId?: number; userId?: string }) => {
  return useQuery({
    queryKey: ['activity', activityId, userId],
    queryFn: async () => {
      const response = await api.get<Activity>(`/activities/${activityId}`);

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId && !!activityId, // Only run the query if userId is provided
  });
};

export default useGetActivityById;
