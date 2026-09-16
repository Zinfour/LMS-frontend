import { api } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usePersistentStore } from './usePersistentStore';

interface UpdateCourseData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string;
  users: string[];
}

const useUpdateCourse = (courseId: number, successCallback: () => void) => {
  const queryClient = useQueryClient();
  const userId = usePersistentStore((state) => state.user?.id);
  const mutation = useMutation({
    mutationFn: async (updatedCourseData: UpdateCourseData) => {
      const response = await api.put(`/courses/${courseId}`, updatedCourseData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Course updated successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courseById', userId, courseId] });
      successCallback();
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast.error('Error updating course');
    },
  });
  return mutation;
};

export default useUpdateCourse;
