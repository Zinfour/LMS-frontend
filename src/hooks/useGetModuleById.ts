import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Module } from './useGetMyCourse';

const useGetModuleById = ({ moduleId, userId }: { moduleId?: number; userId?: number }) => {
  return useQuery({
    queryKey: ['module', moduleId, userId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a 1-second delay
      const response = await axios.get<Module>(`http://localhost:3000/modules/${moduleId}`);

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId && !!moduleId, // Only run the query if userId is provided
  });
};

export default useGetModuleById;
