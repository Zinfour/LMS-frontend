import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import type { Submission } from './useGetModuleById';

interface CreateSubmissionRequest {
  text: string;
  studentId: string;
  assignmentId: number;
}

const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubmissionRequest) => {
      const response = await api.post<Submission>('/submissions', data);

      return response.data;
    },

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['submissions', variables.studentId, variables.assignmentId],
      });
    },
  });
};

export default useCreateSubmission;