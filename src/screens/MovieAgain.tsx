import { useParams } from 'react-router';
import dayjs from 'dayjs';
import useGetMovieById from '../hooks/useGetMovieById';

export default function MovieAgain() {
  const { id } = useParams();
  const { data: movie, isLoading, error } = useGetMovieById(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading movie</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center py-12">!!SECRETE MOVIE PAGE!! 😉</h1>
      <div className="flex gap-8 pt-20">
        <img className="w-75 h-70 object-cover border-pink-500 border-4" src={movie?.img} alt={movie?.title} />
        <div>
          <h1 className="text-4xl font-bold mb-12">{movie?.title}</h1>
          <p className="text-muted-foreground mb-8">{movie?.description}</p>
          <p className="text-muted-foreground mb-2">Director: {movie?.director}</p>
          <p className="text-muted-foreground">Release Date: {dayjs(movie?.releaseDate).format('YYYY/MM/DD')}</p>
        </div>
      </div>
    </div>
  );
}
