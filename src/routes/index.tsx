import { Routes, Route } from 'react-router';
import UnknownRoute from '@/screens/UnkownRoute';
import MyCourseRoute from '@/routes/MyCourseRoute';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/screens/Login';
import Settings from '@/screens/Settings';
import Resources from '@/screens/Resources';
import Courses from '@/screens/Courses';
import Students from '@/screens/Students';
import MainScreensLayout from '@/components/MainScreensLayout';
import Overview from '@/screens/Overview';
import Calendar from '@/screens/Calendar';
import Profile from '@/screens/Profile';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<UnknownRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainScreensLayout />}>
          <Route index element={<Overview />} />

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="my-course/*" element={<MyCourseRoute />} />
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
    </Routes>
  );
}
