import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

interface CreateModuleRequest {
  courseId: number;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string;
}

const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, name, description, startDate, endDate, imageURL }: CreateModuleRequest) => {
      const response = await api.post(`/courses/${courseId}/modules`, {
        name,
        description,
        startDate,
        endDate,
        imageURL: imageURL || null,
      });

      return response.data;
    },

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['courseById', variables.userId, variables.courseId],
      });
    },

    onError: (error) => {
      console.log('Error creating module.', error);
    },
  });
};

export default useCreateModule;