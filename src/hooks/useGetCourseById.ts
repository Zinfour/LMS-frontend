import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { Course } from '@/hooks/useGetCourses';

const useGetCourseById = (courseId?: number) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get<Course>(`/courses/${courseId}`);

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!courseId,
  });
};

export default useGetCourseById;
