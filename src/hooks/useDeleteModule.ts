import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

interface DeleteModuleRequest {
  courseId: number;
  moduleId: number;
  userId: string;
}

const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, moduleId }: DeleteModuleRequest) => {
      await api.delete(`/courses/${courseId}/modules/${moduleId}`);
    },

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['courseById', variables.userId, variables.courseId],
      });
    },

    onError: (error) => {
      console.log('Error deleting module.', error);
    },
  });
};

export default useDeleteModule;
