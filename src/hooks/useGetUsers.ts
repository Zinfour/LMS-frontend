import { api } from '@/api';
import type { DatabaseUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<DatabaseUser[]>('/users');

      return response.data;
    },
    gcTime: 1000 * 60 * 10, // Cache for 10 minutes
    staleTime: 1000 * 30, // Data is considered fresh for 30 seconds
  });
};
