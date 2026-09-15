import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api';
import type { Activity } from '@/hooks/useGetModuleById';
import type { ActivityType } from '@/types';

interface CreateActivityRequest {
  moduleId: number;
  type: ActivityType;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  imageURL?: string;
  assignmentTitle?: string;
  assignmentDescription?: string;
  assignmentDeadline?: string;
}

const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      type,
      name,
      startTime,
      endTime,
      description,
      imageURL,
      assignmentTitle,
      assignmentDescription,
      assignmentDeadline,
    }: CreateActivityRequest) => {
      const activityResponse = await api.post<Activity>('/activities', {
        Type: type,
        Name: name,
        StartTime: startTime,
        EndTime: endTime,
        Description: description,
        ImageURL: imageURL ?? null,
        ModuleId: moduleId,
      });

      const activity = activityResponse.data;

      if (type === 'Assignment' && assignmentTitle && assignmentDescription && assignmentDeadline) {
        await api.post('/assignments', {
          Title: assignmentTitle,
          Description: assignmentDescription,
          Deadline: assignmentDeadline,
          ActivityId: activity.id,
        });
      }

      return activity;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['module', variables.moduleId],
      });
    },
    onError: (error) => {
      console.log('Error creating activity.', error);
    },
  });
};

export default useCreateActivity;
