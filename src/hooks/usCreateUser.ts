import { api } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
  courseId: number;
  imageUrl?: string;
};

const useCreateUser = (successCallback: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await api.post(`/users`, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      successCallback();
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    },
  });
  return mutation;
};

export default useCreateUser;
