import { api } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const useDeleteCourse = (courseId: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/courses/${courseId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast.error('Error deleting course');
    },
  });
  return mutation;
};

export default useDeleteCourse;
