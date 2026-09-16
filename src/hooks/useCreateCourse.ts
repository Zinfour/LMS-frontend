import { api } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type CreateCourseData = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string;
  users?: string[];
};

const useCreateCourse = (successCallback: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (courseData: CreateCourseData) => {
      const response = await api.post(`/courses`, courseData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Course created successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      successCallback();
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast.error('Error creating course');
    },
  });
  return mutation;
};

export default useCreateCourse;
