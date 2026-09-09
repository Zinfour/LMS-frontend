import RoutesIndex from './routes';
import { useEffect } from 'react';
import { usePersistentStore } from './hooks/usePersistentStore';
import { SidebarProvider } from './components/ui/sidebar';

function App() {
  const { theme } = usePersistentStore((state) => ({ theme: state.theme }));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <SidebarProvider>
      <div className="bg-background text-foreground flex w-full">
        <RoutesIndex />
      </div>
    </SidebarProvider>
  );
}

export default App;
