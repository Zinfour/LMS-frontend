import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api';
import type { Activity } from '@/hooks/useGetModuleById';
import type { ActivityType } from '@/types';

interface UpdateActivityRequest {
  moduleId: number;
  activity: Activity;
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

const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activity,
      type,
      name,
      startTime,
      endTime,
      description,
      imageURL,
      assignmentTitle,
      assignmentDescription,
      assignmentDeadline,
    }: UpdateActivityRequest) => {
      const activityResponse = await api.put<Activity>(`/activities/${activity.id}`, {
        Type: type,
        Name: name,
        StartTime: startTime,
        EndTime: endTime,
        Description: description,
        ImageURL: imageURL ?? null,
        ModuleId: activity.moduleId,
      });

      const updatedActivity = activityResponse.data;

      if (type === 'Assignment') {
        if (activity.assignment) {
          await api.put(`/assignments/${activity.assignment.id}`, {
            Title: assignmentTitle ?? '',
            Description: assignmentDescription ?? '',
            Deadline: assignmentDeadline,
            ActivityId: activity.id,
          });
        } else if (assignmentTitle && assignmentDescription && assignmentDeadline) {
          await api.post('/assignments', {
            Title: assignmentTitle,
            Description: assignmentDescription,
            Deadline: assignmentDeadline,
            ActivityId: activity.id,
          });
        }
      }

      return updatedActivity;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['module', variables.moduleId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['activity', variables.activity.id],
      });
    },
    onError: (error) => {
      console.log('Error updating activity.', error);
    },
  });
};

export default useUpdateActivity;
