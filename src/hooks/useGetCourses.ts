import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export interface CourseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
}

export type CourseResourceType = 'Instruction' | 'TextMaterial' | 'Link' | 'Summary' | 'Reference';

export interface CourseResource {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId?: string | null;
  url?: string | null;
  resourceType: CourseResourceType;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string | null;
  courseId: number;
}

export interface Course {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string | null;
  resources: CourseResource[];
  modules: Module[];
  students: CourseUser[];
  teacher: CourseUser;
}

const useGetCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get<Course[]>('/courses');

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export default useGetCourses;
