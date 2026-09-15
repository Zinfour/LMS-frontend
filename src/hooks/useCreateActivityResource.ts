import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import type { ActivityResource } from './useGetModuleById';

export type ResourceType = 'TextMaterial' | 'Instruction' | 'Link';

interface CreateActivityResourceRequest {
  activityId: number;
  resourceType: ResourceType;
  name: string;
  description: string;
  url?: string;
}

const useCreateActivityResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, resourceType, name, description, url }: CreateActivityResourceRequest) => {
      const response = await api.post<ActivityResource>(`/activities/${activityId}/resources`, {
        URL: url ?? null,
        ResourceType: resourceType,
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
      console.log('Error creating activity resource.', error);
    },
  });
};

export default useCreateActivityResource;
