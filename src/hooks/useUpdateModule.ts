import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

interface UpdateModuleRequest {
  id: number;
  createdAt: string;
  courseId: number;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL?: string;
}

const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      createdAt,
      courseId,
      name,
      description,
      startDate,
      endDate,
      imageURL,
    }: UpdateModuleRequest) => {
      await api.put(`/courses/${courseId}/modules/${id}`, {
        id,
        createdAt,
        courseId,
        name,
        description,
        startDate,
        endDate,
        imageURL: imageURL || null,
      });
    },

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['module', variables.id, variables.userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['courseById', variables.userId, variables.courseId],
        }),
      ]);
    },

    onError: (error) => {
      console.log('Error updating module.', error);
    },
  });
};

export default useUpdateModule;
