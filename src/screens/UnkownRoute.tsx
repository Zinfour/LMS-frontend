import { Link } from 'react-router';

export default function UnknownRoute() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <span className="text-7xl font-bold mb-6">🫠</span>
      <h1 className="text-3xl font-bold mb-2">404 - Route Not Found</h1>
      <Link to="/" replace className="underline font-extralight">
        Go to safety
      </Link>
    </div>
  );
}
