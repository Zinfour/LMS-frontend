import { Navigate, Outlet } from 'react-router';
import { useStore } from '@/hooks/useStore';

type Role = 'student' | 'teacher';
export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const user = useStore((state) => state.user);

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
