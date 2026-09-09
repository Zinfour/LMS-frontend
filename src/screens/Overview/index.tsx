import { usePersistentStore } from '@/hooks/usePersistentStore';
import StudentOverview from './StudentOverview';
import TeacherOverview from './TeacherOverview';
import useGetMovies from '@/hooks/useGetMovies';

export default function Overview() {
  const user = usePersistentStore((state) => state.user);
  const { isLoading, isError, data: movies } = useGetMovies(user?.id); // Call the custom hook to fetch movies

  console.log('Movies:', movies); // Log the fetched movies to the console
  console.log('Loading:', isLoading); // Log the loading state
  console.log('Error:', isError); // Log the error state
  return user?.role === 'teacher' ? <TeacherOverview /> : <StudentOverview />;
}
