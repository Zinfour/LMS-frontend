import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Movie {
  title: string;
  director: string;
  releaseDate: string;
  id: number;
  description: string;
  img: string;
}

const useGetMovieById = (id?: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const response = await axios.get<Movie>(`http://localhost:3000/movieById/${id}`);

      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
};

export default useGetMovieById;
