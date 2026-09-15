import Error from '@/components/Error';
import useGetCourseById from '@/hooks/useGetCourseById';
import { useParams } from 'react-router';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import Loading from '@/components/Loading';
import CourseScreenContent from '@/components/CourseScreenContent';

export default function Course() {
  const { courseId } = useParams();
  const user = usePersistentStore((state) => state.user!);
  const { data: myCourse, isLoading, error } = useGetCourseById({ courseid: Number(courseId), userId: user?.id });

  if (isLoading) {
    return (
      <div className="py-8">
        <Loading />
      </div>
    );
  }

  if (error || !myCourse) {
    return (
      <div className="py-8">
        <Error />
      </div>
    );
  }

  return <CourseScreenContent course={myCourse} />;
}
