import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Movie {
  title: string;
  director: string;
  releaseDate: string;
  id: number;
  img: string;
}

const useGetMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second delay
      const response = await axios.get<Movie[]>('http://localhost:3000/movies');

      return response.data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export default useGetMovies;
