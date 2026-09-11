export default function PlaceholderNotice({ message }: { message?: string }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col gap-2 opacity-50 ">
      <p className="text-4xl">🚧</p>
      <p className="text-xl font-semibold">{message || 'Placeholder'}</p>
    </div>
  );
}
