import { Outlet } from 'react-router';
import NavBar from './NavBar';

export default function MainScreensLayout() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <header className="bg-card p-4">
        <NavBar />
      </header>
      <main className="flex-1 max-w-250 mx-auto">
        <Outlet />
      </main>
      <footer className="bg-card p-8 text-center text-muted-foreground">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
