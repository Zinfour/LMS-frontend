import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useGetMovies from '../hooks/useGetMovies';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

export default function Movies() {
  const { data: movies, isLoading, error } = useGetMovies();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading movies</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold py-12 text-center">Movies</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies?.map((movie) => (
          <Card key={movie.id}>
            <img src={movie.img} alt={movie.title} className="relative z-20 aspect-video w-full object-cover " />
            <CardHeader>
              <CardTitle className="text-center">{movie.title}</CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Link className={cn(buttonVariants(), 'w-full text-center py-5')} to={`/movie/${movie.id}`}>
                View Details
              </Link>
              <Link
                className={cn(buttonVariants({ variant: 'link' }), 'w-full text-center text-xs')}
                to={`/secretMovie/${movie.id}`}>
                View Details Again
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
