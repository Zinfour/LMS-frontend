import RoutesIndex from './routes';
import { useEffect } from 'react';
import { usePersistentStore } from './hooks/usePersistentStore';
import { setLogoutOnTokenExpiredTimeout } from './lib/utils';
import { SidebarProvider } from './components/ui/sidebar';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

function App() {
  const { theme } = usePersistentStore((state) => ({ theme: state.theme }));
  const { user, logUserOut } = usePersistentStore((state) => ({ user: state.user, logUserOut: state.logUserOut }));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Check if we still have the user object and if the token is still valid
    if (user) {
      const decodedToken: { exp: number } = jwtDecode(user.token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      // Token has expired, log the user out
      if (decodedToken.exp < currentTime) {
        logUserOut();
        toast.warning('Please log in again.', { description: 'Your session has expired.' });
      } else {
        // Token is still valid, set a timeout to log the user out when the token expires
        setLogoutOnTokenExpiredTimeout(user.token);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <div className="bg-background text-foreground">
        <RoutesIndex />
      </div>
    </SidebarProvider>
  );
}

export default App;
