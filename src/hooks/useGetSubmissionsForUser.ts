import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { Submission } from '@/components/SubmissionCard';

const useGetSubmissionsForUser = ({ userId }: { userId?: string }) => {
  return useQuery({
    queryKey: ['submissions', userId], // Include user ID in the query key to refetch when the user changes
    queryFn: async () => {
      const response = await api.get<Submission[]>(`/users/${userId}/submissions`);

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId, // Only enable the query if userId is defined
  });
};

export default useGetSubmissionsForUser;
