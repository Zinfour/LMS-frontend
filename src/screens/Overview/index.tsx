import { useStore } from '@/hooks/useStore';
import StudentOverview from './StudentOverview';
import TeacherOverview from './TeacherOverview';

export default function Overview() {
  const role = useStore((state) => state.user?.role);

  return role === 'teacher' ? <TeacherOverview /> : <StudentOverview />;
}
