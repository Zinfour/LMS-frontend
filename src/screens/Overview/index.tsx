import { usePersistentStore } from '@/hooks/usePersistentStore';
import StudentOverview from './StudentOverview';
import TeacherOverview from './TeacherOverview';

export default function Overview() {
  const user = usePersistentStore((state) => state.user);

  return user?.role === 'teacher' ? <TeacherOverview /> : <StudentOverview />;
}
