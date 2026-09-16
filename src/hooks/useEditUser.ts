import { api } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type EditUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
  courseId?: number;
  imageUrl?: string;
};

const useEditUser = (userId: string, successCallback: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (userData: EditUserData) => {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      successCallback();
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    },
  });
  return mutation;
};

export default useEditUser;
