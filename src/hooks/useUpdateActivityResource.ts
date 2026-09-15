import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import type { ActivityResource } from '@/hooks/useGetModuleById';
import type { ResourceType } from '@/types';

interface UpdateActivityResourceRequest {
  activityId: number;
  resource: ActivityResource;
  name: string;
  description: string;
  url?: string;
}

const useUpdateActivityResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resource,
      name,
      description,
      url,
    }: UpdateActivityResourceRequest) => {
      const response = await api.put<ActivityResource>(`/activities/resources/${resource.id}`, {
        URL: url ?? null,
        ResourceType: resource.resourceType as ResourceType,
        Name: name,
        Description: description,
      });

      return response.data;
    },

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['activity', variables.activityId],
      });
    },

    onError: (error) => {
      console.log('Error updating activity resource.', error);
    },
  });
};

export default useUpdateActivityResource;