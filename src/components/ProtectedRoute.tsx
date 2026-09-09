import { Navigate, Outlet } from 'react-router';
import { usePersistentStore } from '@/hooks/usePersistentStore';

type Role = 'student' | 'teacher';

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const user = usePersistentStore((state) => state.user);

  // if(isLoading) {
  // 	return <LoadingState />
  // }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
