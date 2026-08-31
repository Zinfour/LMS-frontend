import { useParams } from 'react-router';
import dayjs from 'dayjs';
import useGetMovieById from '../hooks/useGetMovieById';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';

export default function Movie() {
  const { id } = useParams();
  const { data: movie, isLoading, error } = useGetMovieById(id);

  const { count, increaseCount, decreaseCount } = useStore((state) => ({
    count: state.count,
    increaseCount: state.increaseCount,
    decreaseCount: state.decreaseCount,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading movie</div>;
  }

  return (
    <div className="flex gap-8 pt-20">
      <img className="w-75 h-70 object-cover" src={movie?.img} alt={movie?.title} />
      <div>
        <h1 className="text-4xl font-bold mb-12">{movie?.title}</h1>
        <p className="text-muted-foreground mb-8">{movie?.description}</p>
        <p className="text-muted-foreground mb-2">Director: {movie?.director}</p>
        <p className="text-muted-foreground">Release Date: {dayjs(movie?.releaseDate).format('MMMM D, YYYY')}</p>
        <div className="mt-8 flex gap-4 items-center">
          <Button variant="outline" className="px-4" onClick={decreaseCount}>
            -
          </Button>
          <p>Counter is: {count}</p>
          <Button variant="outline" className="px-4" onClick={increaseCount}>
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
