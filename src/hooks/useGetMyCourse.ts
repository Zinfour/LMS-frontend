import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Course {
  id: number;
  name: string;
  description: string;
  teacher: string;
  modules: Module[];
}

export interface Module {
  id: number;
  name: string;
  description: string;
  activities: Activity[];
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  activityType: string;
  textMaterial?: string;
  instructions?: string;
  resources: Resource[];
  deadline: string;
}

export interface Resource {
  name: string;
  url: string;
  mime: string;
  description: string;
}

const useGetMyCourse = ({ userId }: { userId?: number }) => {
  return useQuery({
    queryKey: ['myCourse', userId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a 1-second delay
      const response = await axios.get<Course>('http://localhost:3000/course');

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId, // Only run the query if userId is provided
  });
};

export default useGetMyCourse;
