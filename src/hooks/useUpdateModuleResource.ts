import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import type { ModuleResource } from '@/hooks/useGetModuleById';

interface UpdateModuleResourceRequest {
  moduleId: number;
  resource: ModuleResource;
  name: string;
  description: string;
  url?: string;
}

const useUpdateModuleResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resource, name, description, url }: UpdateModuleResourceRequest) => {
      const response = await api.put<ModuleResource>(`/modules/resources/${resource.id}`, {
        URL: url ?? null,
        ResourceType: resource.resourceType,
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
      console.log('Error updating module resource.', error);
    },
  });
};

export default useUpdateModuleResource;