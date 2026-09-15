import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import type { ModuleResource } from '@/hooks/useGetModuleById';
import type { ResourceType } from '@/types';

interface CreateModuleResourceRequest {
  moduleId: number;
  resourceType: ResourceType;
  name: string;
  description: string;
  url?: string;
}

const useCreateModuleResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, resourceType, name, description, url }: CreateModuleResourceRequest) => {
      const response = await api.post<ModuleResource>(`/modules/${moduleId}/resources`, {
        URL: url ?? null,
        ResourceType: resourceType,
        Name: name,
        Description: description,
      });

      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['module', variables.moduleId],
      });
    },
    onError: (error) => {
      console.log('Error creating module resource.', error);
    },
  });
};

export default useCreateModuleResource;