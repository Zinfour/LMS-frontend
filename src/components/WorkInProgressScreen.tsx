export default function WorkInProgressScreen({ title }: { title: string }) {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-xl font-semibold px-8 py-8">{title}</h1>
      <div className="flex flex-col items-center justify-center gap-4 mt-8 flex-1">
        <span className="text-6xl">🚧</span>
        <h2 className="text-2xl font-semibold">Work in Progress</h2>
      </div>
    </div>
  );
}
