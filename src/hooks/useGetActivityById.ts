// http://localhost:3000/activities/1
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Activity } from './useGetMyCourse';

const useGetActivityById = ({ activityId, userId }: { activityId?: number; userId?: number }) => {
  return useQuery({
    queryKey: ['activity', activityId, userId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a 1-second delay
      const response = await axios.get<Activity>(`http://localhost:3000/activities/${activityId}`);

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId && !!activityId, // Only run the query if userId is provided
  });
};

export default useGetActivityById;
