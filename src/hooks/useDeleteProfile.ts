import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useDeleteProfile = (userId: string, successCallback: () => void) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile deleted successfully');
      successCallback();
    },
    onError: (error) => {
      console.error('Error deleting profile:', error);
      toast.error('Error deleting profile');
    },
  });
  return mutation;
};

export default useDeleteProfile;
