import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useUpdateProfilePhoto = (userId: string, successCallback: (newImageUrl: string | undefined) => void) => {
  const mutation = useMutation({
    mutationFn: async (newImageUrl: string | undefined) => {
      const response = await api.patch(`/users/${userId}/profileImage`, newImageUrl);
      return response.data;
    },
    onSuccess: (_, newImageUrl) => {
      toast.success(newImageUrl ? 'Profile photo updated successfully' : 'Profile photo removed successfully');
      successCallback(newImageUrl);
    },
    onError: (error) => {
      console.error('Error updating profile photo:', error);
      toast.error('Error updating profile photo');
    },
  });
  return mutation;
};

export default useUpdateProfilePhoto;
