import { Routes, Route } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './screens/Login';
import { useEffect } from 'react';
import { usePersistentStore } from './hooks/usePersistentStore';
import Settings from './screens/Settings';
import Resources from './screens/Resources';
import Courses from './screens/Courses';
import Students from './screens/Students';
import MainScreensLayout from './components/MainScreensLayout';
import ScreenLayout from './components/ScreenLayout';
import Overview from './screens/Overview';
import MyCourse from './screens/MyCourse';
import Calendar from './screens/Calendar';
import Movie from './screens/Movie';
import MovieAgain from './screens/MovieAgain';
import Profile from './screens/Profile';
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
      <div className="bg-background text-foreground">
        <Routes>
          <Route path="login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainScreensLayout />}>
              <Route index element={<Overview />} />

              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="my-course" element={<MyCourse />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="courses" element={<Courses />} />
                <Route path="students" element={<Students />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="resources" element={<Resources />} />
            </Route>
          </Route>

          <Route element={<ScreenLayout />}>
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/secretMovie/:id" element={<MovieAgain />} />
          </Route>
        </Routes>
      </div>
    </SidebarProvider>
  );
}

export default App;
