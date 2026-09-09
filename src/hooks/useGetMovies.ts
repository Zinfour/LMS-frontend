import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export interface Movie {
  title: string;
  director: string;
  releaseDate: string;
  id: number;
  img: string;
}

const useGetMovies = (userId?: number) => {
  return useQuery({
    queryKey: ['movies', userId], // Include user ID in the query key to refetch when the user changes
    queryFn: async () => {
      console.log('Fetching movies for user:', userId); // Log the user ID for debugging
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second delay
      const response = await api.get<Movie[]>('/movies');

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId, // Only enable the query if userId is defined
  });
};

export default useGetMovies;
