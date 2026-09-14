import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { Submission } from './useGetModuleById';

const useGetSubmissionsForUser = ({
  userId,
  assignmentId,
  enabled = true,
}: {
  userId?: string;
  assignmentId?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['submissions', userId, assignmentId], // Include user ID in the query key to refetch when the user changes
    queryFn: async () => {
      const response = await api.get<Submission[]>(
        `/users/${userId}/submissions`,
        assignmentId !== undefined ? { params: { assignmentId } } : undefined,
      );
      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId && enabled, // Only enable the query if userId is defined and caller allows it.
  });
};

export default useGetSubmissionsForUser;
