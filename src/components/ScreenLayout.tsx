import { Outlet } from 'react-router';

export default function ScreenLayout() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <main className="flex-1 max-w-250 mx-auto">
        <Outlet />
      </main>
      <footer className="bg-card p-8 text-center text-muted-foreground">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
